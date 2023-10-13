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

export let currentState

export function initUpdate() {
    let val = project.registry
    let sound = project.sound

    let asteroids = val.asteroids
    let shipSprite = val.shipSprite
    let flameSprite = val.flameSprite
    let bullets = val.bullets
    let explosions = val.explosions
    let bonuses = val.bonuses
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
            let asteroid = createAsteroid(val.asteroidType.big, rnd(rad(360)))
            asteroid.moveToPerimeter(val.bounds)
        }
        explodingAsteroidLevelInit(num)
        if(level > 1) score.increment(val.levelBonus)
    }

    function reset() {
        lives.value = val.startingLives
        score.value = 0
        asteroids.clear()
        level.value = 0
        nextLifeBonus = val.nextLifeBonus
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
        if(this.collidesWithSprite(val.shipSprite)) {
            destroyShip()
        }
    }

    function explodingAsteroidLevelInit(num) {
        for(let i = 1; i <= num; i += 5) {
            let asteroid = createAsteroid(val.template.explodingAsteroid, rnd(360))
            asteroid.moveToPerimeter(val.bounds)
        }
    }

    // weapons

    let weapon = template.weapon

    // fireball

    weapon.fireball.update = function() {
        if(val.currentWeapon !== this || currentState !== val.state.alive) return

        if(this.controller.active()) {
            let bullet = Sprite.createFromTemplate(weapon.fireball.bullet)
            bullet.setPositionAs(weapon.gun)
            bullet.turn(shipSprite.angle)
            play(sound.fireball)
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
        for (let i = 0; i <= 1; i++) {
            let gunfire = this.gunfire[i]
            gunfire.setPositionAs(this.barrelEnd[i])
            gunfire.setAngleAs(shipSprite)
        }

        if(val.currentWeapon !== this || currentState !== val.state.alive) return
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
                val.currentWeapon = template.weapon.fireball
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
        if(currentState !== val.state.alive) return

        if(this.ammo.value > 0 && this.controller.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(weapon.gun)
            missile.turn(shipSprite.angle)
            this.ammo.decrement()
            play(sound.fireMissile)
        }
    }

    launcher.collect = function() {
        this.ammo.increment(1, this.maxAmmo)
    }

    // main

    let nextLifeBonus = val.nextLifeBonus
    let invTime = 0

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
                val.invulnerable = true
                invTime = val.invulnerabilityTime
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
            if(weapon.update) weapon.update()
        }

        // asteroid bonus

        val.bonuses.collisionWith(val.shipSprite, function(bonus) {
            bonus.weapon.collect()
            play(sound.bonus)
            bonuses.remove(bonus)
        })

        // extra life

        if(val.score.value >= nextLifeBonus) {
            lives.increment()
            play(sound.extraLife)
            nextLifeBonus += val.nextLifeBonus
        }

        // camera

        currentCanvas.setPositionAs(val.shipSprite)
        val.bounds.setPositionAs(val.shipSprite)
        val.hud.setPositionAs(val.shipSprite)

        // invulnerability

        if(val.invulnerable) {
            val.invulnerabilityAction.execute()
            invTime -= apsk
            if(invTime <= 0) val.invulnerable = false
        }
    }
}