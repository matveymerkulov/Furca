import Sprite from "../../sprite.js"
import {apsk, loc, loopedSound, num, paused, play, rad, rnd, rndi, togglePause} from "../../system.js"
import LinearChange from "../../actions/linear_change.js"
import {project} from "../../project.js"
import RotateImage from "../../actions/sprite/rotate_image.js"
import DelayedRemove from "../../actions/sprite/delayed_remove.js"
import AnimateSize from "../../actions/sprite/animate_size.js"
import Cos from "../../function/cos.js"
import AnimateAngle from "../../actions/sprite/animate_angle.js"
import {currentCanvas} from "../../canvas.js"
import DelayedHide from "../../actions/sprite/delayed_hide.js"
import {
    asteroids,
    bonuses,
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
import {ShapeType} from "../../shape_type.js"

export function initUpdate() {
    let sound = project.sound
    let key = project.key

    let currentState = state.alive

    loopedSound(sound.music, 0, 1.81, true)
    let flameSound = loopedSound(sound.flame, 1.1, 1.9)

    // level

    function initLevel(num) {
        for(let i = 0; i < num; i++) {
            let asteroid = createAsteroid(template.asteroidType.big, rnd(rad(360)))
            asteroid.moveToPerimeter(bounds)
        }
        explodingAsteroidLevelInit(num)
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

        // bonus

        for(let weapon of Object.values(template.weapon)) {
            if(!weapon.bonus) continue
            if(rnd() > weapon.probability) continue

            let bonus = Sprite.createFromTemplate(weapon.bonus)
            bonus.weapon = weapon
            bonus.setPositionAs(asteroid)
            bonus.add(new AnimateSize(bonus, new Cos(0.45, 0.1, 0, 1)))
            bonus.add(new AnimateAngle(bonus, new Cos(0.9, rad(15))))
            bonuses.add(bonus)
            return
        }
    }

    function explosionDamage(sprite) {
        sprite.size = sprite.explosionSize
        let inExplosion = []
        sprite.collisionWith(asteroids, (mis, asteroid) => {
            inExplosion.push(asteroid)
        })
        inExplosion.forEach((asteroid) => {
            destroyAsteroid(asteroid, sprite.angleTo(asteroid.centerX, asteroid.centerY))
        })
    }

    // explosion

    function createSingleExplosion(sprite, size, playSnd = true) {
        let explosion = Sprite.createFromTemplate(template.explosion)
        explosion.size = size
        explosion.moveTo(sprite.centerX, sprite.centerY)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        if(playSnd) play(sound.explosion)
    }

    function createExplosion(sprite, size, playSnd = true) {
        let times = rndi(3) + size
        createParticle(true)
        if(playSnd) play(sound.explosion)

        function createParticle(first) {
            let angle = rad(rnd(360))
            let length = first ? 0 : Math.sqrt(rnd(1))
            let particleSize = first ? size : (1 - length / 2) * size

            let explosion = Sprite.create(explosions, template.explosion.images
                , sprite.centerX + length * Math.cos(angle), sprite.centerY + length * Math.sin(angle)
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
            play(sound.gameOver)
        } else {
            messageLabel.show(loc("pressEnter"))
            currentState = state.dead
            play(sound.death)
        }
    }

    // exploding asteroid

    template.explodingAsteroid.parameters.onHit = function() {
        removeAsteroid(this)
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }

    function explodingAsteroidLevelInit(num) {
        for(let i = 1; i <= num; i += 5) {
            let asteroid = createAsteroid(template.explodingAsteroid, rnd(360))
            asteroid.moveToPerimeter(bounds)
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
            play(sound.fireball)
        }
    }

    // turret

    let turret = weapon.turret

    turret.collect = function() {
        currentWeapon = this
        this.ammo.increment(this.bonusAmmo, this.maxAmmo)
        this.sprite.visible = true
    }

    turret.update = function() {
        for (let i = 0; i <= 1; i++) {
            let gunfire = this.gunfire[i]
            gunfire.setPositionAs(this.barrelEnd[i])
            gunfire.setAngleAs(shipSprite)
        }

        if(currentWeapon !== this || currentState !== state.alive) return
        let sprite = this.sprite

        if(this.controller.active()) {
            for (let i = 0; i <= 1; i++) {
                let bullet = Sprite.createFromTemplate(this.bullet)
                bullet.setPositionAs(this.barrelEnd[i])
                bullet.setAngleAs(shipSprite)
                bullet.onHit = () => {
                    play(sound.bulletHit)
                }

                let gunfire = this.gunfire[i]
                gunfire.actions = [new DelayedHide(gunfire, this.gunfireTime)]
                gunfire.show()
            }
            play(sound.bullet)
            this.ammo.decrement()
            if(this.ammo.value === 0) {
                sprite.visible = false
                currentWeapon = template.weapon.fireball
            }
        }

        sprite.setPositionAs(shipSprite)
        sprite.angle = shipSprite.angle
    }

    // missile launcher

    let launcher = weapon.launcher

    launcher.missile.parameters.onHit = function() {
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }

    launcher.update = function() {
        if(currentState !== state.alive) return

        if(this.ammo.value > 0 && this.controller.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(gun)
            missile.turn(shipSprite.angle)
            this.ammo.decrement()
            play(sound.fireMissile)
        }
    }

    launcher.collect = function() {
        this.ammo.increment(1, this.maxAmmo)
    }

    // main

    let nextLifeBonus = lifeBonus
    let invTime = 0
    let invulnerable = false

    project.update = () => {
        if(key.pause.wasPressed) {
            togglePause()
            if(paused) {
                messageLabel.show(loc("paused"))
            } else {
                messageLabel.show()
            }
        }
        if(paused) return

        if(currentState === state.alive) {
            if(key.left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(shipAngularSpeed))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(shipAngularSpeed))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", shipAcceleration, 0, shipAccelerationLimit)
                flameSound?.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -shipDeceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            let thrust = key.forward.isDown
            flameSprite.visible = thrust
            if(thrust) {

            }

            if(!invulnerable) {
                shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                    destroyShip()
                    destroyAsteroid(asteroid, 0)
                })
            }
        } else if(key.continue.wasPressed) {
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
            play(sound.newLevel)
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            onAsteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })

        // weapon

        for(const weapon of Object.values(template.weapon)) {
            weapon.update?.()
        }

        // asteroid bonus

        bonuses.collisionWith(shipSprite, function(bonus) {
            bonus.weapon.collect()
            play(sound.bonus)
            bonuses.remove(bonus)
        })

        // extra life

        if(score.value >= nextLifeBonus) {
            lives.increment()
            play(sound.extraLife)
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