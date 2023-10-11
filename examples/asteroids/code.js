import Sprite from "../../sprite.js"
import {apsk, loc, loopedSound, num, paused, playSound, rad, rnd, rndi, togglePause} from "../../system.js"
import LinearChange from "../../actions/linear_change.js"
import {project} from "../../project.js"
import RotateImage from "../../actions/sprite/rotate_image.js"
import DelayedRemove from "../../actions/sprite/delayed_remove.js"
import SetSize from "../../actions/sprite/set_size.js"
import Cos from "../../function/cos.js"
import SetAngle from "../../actions/sprite/set_angle.js"
import {currentCanvas} from "../../canvas.js"

export let currentState

export function initUpdate() {
    let val = project.registry
    let sound = project.sound

    let asteroids = val.asteroids
    let shipSprite = val.shipSprite
    let flameSprite = val.flameSprite
    let bullets = val.bullets
    let explosions = val.explosions
    let shipLayer = val.shipLayer

    let lives = val.lives
    let messageLabel = val.messageLabel
    let level = val.level
    let score = val.score

    let state = val.state
    let key = project.key
    let template = val.template
    let ship = val.ship

    currentState = state.alive

    loopedSound(sound.music, 0, 1.81, true)
    let flameSound = loopedSound(sound.flame, 1.1, 1.9)

    // level

    function initLevel(num) {
        for(let i = 0; i < num; i++) {
            let asteroid = createAsteroid(0, 0, val.asteroidType.big, rnd(rad(360)))
            asteroid.moveToPerimeter(val.bounds)
        }
        explodingAsteroidLevelInit(num)
        if(level > 1) val.score.increment(val.levelBonus)
    }

    // asteroid

    function createAsteroid(centerX, centerY, type, angle = 0) {
        let asteroid = Sprite.createFromTemplate(type)
        if(centerY === undefined) {
            asteroid.setPositionAs(centerX.toSprite())
        } else {
            asteroid.moveTo(centerX, centerY)
        }
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
            createAsteroid(asteroid, undefined, piece.type, angle + rad(piece.angle))
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
            bonus.add(new SetSize(bonus, new Cos(0.45, 0.1, 0, 1)))
            bonus.add(new SetAngle(bonus, new Cos(0.9, rad(15))))
            val.bonuses.add(bonus)
            return
        }
    }

    function explosionDamage(sprite) {
        sprite.size = sprite.explosionSize
        let inExplosion = []
        sprite.collisionWith(val.asteroids, (mis, asteroid) => {
            inExplosion.push(asteroid)
        })
        inExplosion.forEach((asteroid) => {
            destroyAsteroid(asteroid, sprite.angleTo(asteroid))
        })
    }

    // explosion

    function createSingleExplosion(sprite, size, playSnd = true) {
        let explosion = Sprite.createFromTemplate(template.explosion)
        explosion.width = explosion.height = size
        explosion.moveTo(sprite.centerX, sprite.centerY)
        explosion.add(new DelayedRemove(explosion, explosions, 1.0))
        if(playSnd) playSound(sound.explosion)
    }

    function createExplosion(sprite, size, playSnd = true) {
        let times = rndi(3) + size
        createParticle(true)
        if(playSnd) playSound(sound.explosion)

        function createParticle(first) {
            let angle = rad(rnd(360))
            let length = first ? 0 : rnd(1)
            let particleSize = first ? size : (1 - length / 2) * size

            let explosion = Sprite.create(explosions, val.explosionImages
                , sprite.centerX + length * Math.cos(angle), sprite.centerY + length * Math.sin(angle)
                , particleSize, particleSize, rad(rnd(360)), 0, 16)
            explosion.add(new DelayedRemove(explosion, explosions, 1))
            times--
            if(times > 0) setTimeout(createParticle, 100)
        }
    }

    // ship

    function destroyShip() {
        createExplosion(shipSprite, 2)
        val.shipSprite.setFromTemplate(template.ship)
        val.shipLayer.hide()
        if(lives.value === 0) {
            messageLabel.show(loc("gameOver"))
            currentState = state.gameOver
            playSound(sound.gameOver)
        } else {
            messageLabel.show(loc("pressEnter"))
            currentState = state.dead
            playSound(sound.death)
        }
    }

    // exploding asteroid

    val.template.explodingAsteroid.parameters.onHit = function() {
        removeAsteroid(this)
        explosionDamage(this, 5)
        if(this.collidesWithSprite(val.shipSprite)) {
            destroyShip()
        }
    }

    function explodingAsteroidLevelInit(num) {
        for(let i = 5; i <= num; i += 5) {
            let asteroid = createAsteroid(0, 0, val.template.explodingAsteroid, rnd(360))
            asteroid.moveToPerimeter(val.bounds)
        }
    }

    // weapons

    let weapon = template.weapon

    // fireball

    weapon.fireball.update = function() {
        if(val.currentWeapon !== this || currentState !== val.state.alive) return

        if(this.gunController.active()) {
            let bullet = Sprite.createFromTemplate(weapon.fireball.bullet)
            bullet.setPositionAs(weapon.gun)
            bullet.turn(val.shipSprite.angle)
            playSound(sound.fireball)
        }
    }

    // turret

    let turret = weapon.turret

    turret.collect = function() {
        val.currentWeapon = this
        this.ammo.increment(this.bonusAmmo, this.maxAmmo)
        this.sprite.visible = true
    }

    turret.update = function() {
        if(val.currentWeapon !== this || currentState !== val.state.alive) return
        let sprite = this.sprite

        if(this.controller.active()) {
            for (let i = 0; i <= 1; i++) {
                let bullet = Sprite.createFromTemplate(this.bullet)
                bullet.setPositionAs(this.barrelEnd[i])
                bullet.turn(val.shipSprite.angle)
                bullet.onHit = () => {
                    playSound(sound.bulletHit)
                }

                let gunfire = Sprite.createFromTemplate(this.gunfireTemplate)
                gunfire.setPositionAs(this.barrelEnd[i])
                gunfire.turn(val.shipSprite.angle)
                gunfire.add(new DelayedRemove(gunfire, val.shipLayer, 0.05))
                this.gunfire[i] = gunfire
            }
            playSound(sound.bullet)
            this.ammo.decrement()
            if(this.ammo.value === 0) {
                sprite.visible = false
                val.currentWeapon = template.weapon.fireball
            }
        }

        let ship = val.shipSprite
        sprite.setPositionAs(ship)
        sprite.angle = ship.angle
        if(this.gunfire[0]) {
            this.gunfire[0].setPositionAs(this.barrelEnd[0])
            this.gunfire[1].setPositionAs(this.barrelEnd[1])
        }
    }

    // missile launcher

    let launcher = weapon.launcher

    launcher.missile.parameters.onHit = function() {
        explosionDamage(this, 5)
        if(this.collidesWithSprite(val.shipSprite)) {
            destroyShip()
        }
    }

    launcher.update = function() {
        if(currentState !== val.state.alive) return

        if(this.ammo.value > 0 && this.delay.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(weapon.gun)
            missile.turn(val.shipSprite.angle)
            this.ammo.decrement()
            playSound(sound.fireMissile)
        }
    }

    launcher.collect = function() {
        this.ammo.increment(1, this.maxAmmo)
    }

    // main

    let nextLifeBonus = val.nextLifeBonus
    let blinkTime = 0

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
                LinearChange.execute(shipSprite, "angle", -rad(ship.angularSpeed))
            }

            if(key.right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(ship.angularSpeed))
            }

            if(key.forward.isDown) {
                LinearChange.execute(shipSprite,"speed", ship.acceleration, 0, ship.accelerationLimit)
                if(flameSound) flameSound.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -ship.deceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = key.forward.isDown

            if(!val.invulnerable) {
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
                blinkTime = val.invulnerabilityTime
                val.invulnerable = true
            } else {
                lives.value = val.startingLives
                score.value = 0
                asteroids.clear()
                level.value = 0
                nextLifeBonus = val.nextLifeBonus
            }
            currentState = state.alive
        } else {
            if(!flameSound.paused) flameSound.pause()
        }

        if(asteroids.isEmpty()) {
            level.increment()
            initLevel(level.value)
            playSound(sound.newLevel)
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            onAsteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })

        // weapon

        for(const weapon of Object.values(template.weapon)) {
            if(weapon.update) weapon.update()
        }

        // asteroid bonus

        val.bonuses.collisionWith(val.shipSprite, function(bonus) {
            bonus.weapon.collect()
            playSound(sound.bonus)
            val.bonuses.remove(bonus)
        })

        // extra life

        if(val.score.value >= val.nextLifeBonus) {
            val.lives.increment()
            playSound(sound.extraLife)
            nextLifeBonus += val.nextLifeBonus
        }

        // camera

        currentCanvas.setPositionAs(val.shipSprite)
        val.bounds.setPositionAs(val.shipSprite)
        val.hud.setPositionAs(val.shipSprite)

        // invulnerability

        if(val.invulnerable) {
            if(blinkTime <= 0) {
                val.shipLayer.visible = true
                val.invulnerable = false
            } else {
                val.shipLayer.visible = ((blinkTime / val.blinkingSpeed) % 2) > 1
                blinkTime -= apsk
            }
        }
    }
}