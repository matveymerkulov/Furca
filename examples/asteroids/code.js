import {Sprite} from "../../src/sprite.js"
import {apsk, loc, loopedSound, num, paused, play, togglePause} from "../../src/system.js"
import {LinearChange} from "../../src/actions/linear_change.js"
import {project} from "../../src/project.js"
import {RotateImage} from "../../src/actions/sprite/rotate_image.js"
import {DelayedRemove} from "../../src/actions/sprite/delayed_remove.js"
import {currentCanvas} from "../../src/canvas.js"
import {
    asteroids,
    bounds,
    bullets,
    explosions,
    flameSprite,
    gun,
    hud,
    invulnerabilityAction,
    invulnerabilityTime,
    level,
    levelBonus,
    lifeBonus,
    lives,
    messageLabel,
    score,
    shipAcceleration,
    shipAccelerationLimit,
    shipAngularSpeed,
    shipDeceleration,
    shipLayer,
    shipSprite,
    startingLives,
    startingWeapon,
    state,
    template
} from "./data.js"
import {Key} from "../../src/key.js"
import {ShapeType} from "../../src/shape.js"
import {rad, rnd, rndi} from "../../src/functions.js"

export function initUpdate() {
    let left = new Key("ArrowLeft")
    let right = new Key("ArrowRight")
    let forward = new Key("ArrowUp")
    let newGame = new Key("Enter")
    let pause = new Key("KeyP")

    let currentState = state.alive

    loopedSound("music", 0, 1.81, true)
    let flameSound = loopedSound("flame", 1.1, 1.9)

    // level

    function initLevel(num) {
        for(let i = 0; i < num; i++) {
            let asteroid = createAsteroid(template.asteroidType.big, rnd(rad(360)))
            asteroid.moveToPerimeter(bounds)
        }
        if(level > 1) score.increment(levelBonus)
    }

    function reset() {
        lives.value = startingLives
        score.value = 0
        asteroids.clear()
        level.value = 0
        nextLifeBonus = lifeBonus
        currentWeapon = startingWeapon
    }

    // asteroid

    function createAsteroid(type, angle = 0) {
        let asteroid = Sprite.createFromTemplate(type)
        asteroid.turn(angle)
        asteroid.type = type
        asteroid.imageAngle = 0
        asteroid.add(new RotateImage(asteroid, num(type.rotationSpeed)))
        return asteroid
    }

    function removeAsteroid(asteroid) {
        score.increment(asteroid.type.score)
        asteroids.remove(asteroid)
    }

    function onAsteroidHit(asteroid, bullet) {
        asteroid.hp -= bullet.damage
        if(asteroid.hp <= 0) destroyAsteroid(asteroid, bullet.angle)
        createSingleExplosion(bullet, bullet.explosionSize, false)
        if(bullet.onHit) bullet.onHit()
    }

    function destroyAsteroid(asteroid, angle) {
        asteroid.type.pieces?.forEach(piece => {
            createAsteroid(piece.type, angle + rad(piece.angle)).setPositionAs(asteroid)
        })
        if(asteroid.onHit) asteroid.onHit()
        createExplosion(asteroid, asteroid.width)
        removeAsteroid(asteroid)
    }

    // explosion

    function createSingleExplosion(sprite, size, playSnd = true) {
        let explosion = Sprite.createFromTemplate(template.explosion)
        explosion.size = size
        explosion.setPosition(sprite.x, sprite.y)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        if(playSnd) play("explosion")
    }

    function createExplosion(sprite, size, playSnd = true) {
        let times = rndi(3) + size
        createParticle(true)
        if(playSnd) play("explosion")

        function createParticle(first) {
            let angle = rad(rnd(360))
            let length = first ? 0 : Math.sqrt(rnd(1))
            let particleSize = first ? size : (1 - length / 2) * size

            let explosion = Sprite.create(explosions, template.explosion.images
                , sprite.x + length * Math.cos(angle), sprite.y + length * Math.sin(angle)
                , particleSize, particleSize, ShapeType.circle, rad(rnd(360)), 0, 16)
            explosion.add(new DelayedRemove(explosion, explosions, 1))
            times--
            if(times > 0) setTimeout(createParticle, 100)
        }
    }

    // ship

    function destroyShip() {
        createExplosion(shipSprite, 2)
        shipSprite.setFromTemplate(template.ship)
        shipLayer.hide()
        if(lives.value === 0) {
            messageLabel.show(loc("gameOver"))
            currentState = state.gameOver
            play("game_over")
        } else {
            messageLabel.show(loc("pressEnter"))
            currentState = state.dead
            play("death")
        }
    }

    // weapons

    let weapon = template.weapon
    let currentWeapon = startingWeapon

    // fireball

    weapon.fireball.update = function() {
        if(currentWeapon !== this || currentState !== state.alive) return

        if(this.controller.active()) {
            let bullet = Sprite.createFromTemplate(weapon.fireball.bullet)
            bullet.setPositionAs(gun)
            bullet.turn(shipSprite.angle)
            play("fireball")
        }
    }

    // main

    let nextLifeBonus = lifeBonus
    let invTime = 0
    let invulnerable = false

    project.update = () => {
        if(pause.wasPressed) {
            togglePause()
            if(paused) {
                messageLabel.show(loc("paused"))
            } else {
                messageLabel.show()
            }
        }
        if(paused) return

        if(currentState === state.alive) {
            if(left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(shipAngularSpeed))
            }

            if(right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(shipAngularSpeed))
            }

            if(forward.isDown) {
                LinearChange.execute(shipSprite,"speed", shipAcceleration, 0, shipAccelerationLimit)
                flameSound?.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -shipDeceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = forward.isDown

            if(!invulnerable) {
                shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                    destroyShip()
                    destroyAsteroid(asteroid, 0)
                })
            }
        } else if(newGame.wasPressed) {
            shipLayer.show()
            messageLabel.show()
            if(currentState === state.dead) {
                lives.decrement()
                invulnerable = true
                invTime = invulnerabilityTime
            } else {
                reset()
            }
            currentState = state.alive
        } else {
            if(!flameSound.paused) flameSound.pause()
        }

        if(asteroids.isEmpty()) {
            level.increment()
            initLevel(level.value)
            play("new_level")
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            onAsteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })

        // weapon

        for(const weapon of Object.values(template.weapon)) {
            weapon.update?.()
        }

        // extra life

        if(score.value >= nextLifeBonus) {
            lives.increment()
            play("extra_life")
            nextLifeBonus += nextLifeBonus
        }

        // camera

        currentCanvas.setPositionAs(shipSprite)
        bounds.setPositionAs(shipSprite)
        hud.setPositionAs(shipSprite)

        // invulnerability

        if(invulnerable) {
            invulnerabilityAction.execute()
            invTime -= apsk
            if(invTime <= 0) invulnerable = false
        }
    }
}