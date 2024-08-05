import Num from "../../src/variable/number.js"
import Box from "../../src/box.js"
import {currentCanvas} from "../../src/canvas.js"
import Label from "../../src/gui/label.js"
import {Align, defaultCanvas, loc, rad} from "../../src/system.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import ImageArray from "../../src/image_array.js"
import Layer from "../../src/layer.js"
import Key from "../../src/key.js"
import LoopArea from "../../src/actions/sprite/loop_area.js"
import Move from "../../src/actions/sprite/move.js"
import Animate from "../../src/actions/sprite/animate.js"
import Constraint from "../../src/constraint.js"
import RemoveIfOutside from "../../src/actions/sprite/remove_if_outside.js"
import {project} from "../../src/project.js"
import {initUpdate} from "./code.js"
import Rnd from "../../src/function/rnd.js"
import {rnds} from "../../src/function/random_sign.js"
import Mul from "../../src/function/mul.js"
import Turbo from "../../src/actions/turbo.js"
import Point from "../../src/point.js"
import AnimateOpacity from "../../src/actions/sprite/blink.js"
import Cos from "../../src/function/cos.js"
import AnimateSize from "../../src/actions/sprite/animate_size.js"

project.locales.en = {
    // hud

    level: "LEVEL ",
    pressEnter: "PRESS ENTER",
    gameOver: "GAME OVER",
    paused: "PAUSED",
    ammo: "AMMO: ",
    missiles: "MISSILES: ",

    // keys

    left: "Turn left",
    right: "Turn right",
    forward: "Thrust",
    fire: "Fire",
    pause: "Pause",
}

project.locales.ru = {
    level: "УРОВЕНЬ ",
    pressEnter: "НАЖМИТЕ ENTER",
    gameOver: "ИГРА ОКОНЧЕНА",
    paused: "ПАУЗА",
    ammo: "ПАТРОНЫ: ",
    missiles: "РАКЕТЫ: ",

    left: "Повернуть влево",
    right: "Повернуть вправо",
    forward: "Ускоряться",
    fire: "Стрелять",
    pause: "Пауза",
}

project.getAssets = () => {
    return {
        texture: {
            asteroid: "textures/asteroid.png",
            bullet: "textures/bullet.png",
            emptyBonus: "textures/empty_bonus.png",
            explodingAsteroid: "textures/exploding_asteroid.png",
            explosion: "textures/explosion.png",
            fireball: "textures/fireball.png",
            flame: "textures/flame.png",
            flameParticle: "textures/flame_particle.png",
            gunfire: "textures/gunfire.png",
            missile: "textures/missile.png",
            missileBonus: "textures/missile_bonus.png",
            missileIcon: "textures/missile_icon.png",
            ship: "textures/ship.png",
            turret: "textures/turret.png",
            turretBonus: "textures/turret_bonus.png",
            ammoIcon: "textures/ammo_icon.png",
        },
        sound: {
            bonus: "sounds/bonus.mp3",
            bullet: "sounds/bullet.mp3",
            bulletHit: "sounds/bullet_hit.mp3",
            death: "sounds/death.mp3",
            explosion: "sounds/explosion.mp3",
            extraLife: "sounds/extra_life.mp3",
            fireMissile: "sounds/fire_missile.ogg",
            fireball: "sounds/fireball.mp3",
            flame: "sounds/flame.mp3",
            gameOver: "sounds/game_over.mp3",
            music: "sounds/music.mp3",
            newLevel: "sounds/new_level.mp3",
        }
    }
}

// settings

export const startingLives = 3
export const shipAcceleration = 25
export const shipDeceleration = 15
export const shipAccelerationLimit = 7.5
export const shipAngularSpeed = 180
export const lifeBonus = 25000
export const levelBonus = 1000
export const invulnerabilityTime = 2

// variables

export const score = new Num()
export const lives = new Num(startingLives)
export const level = new Num()

// layers

export const bullets = new Layer()
export const shipLayer = new Layer()
export const asteroids = new Layer()
export const particles = new Layer()
export const bonuses = new Layer()
export const explosions = new Layer()

// other

export let template, shipSprite, invulnerabilityAction, messageLabel, hud, bounds, startingWeapon, gun, flameSprite
export const state = {
    alive: 0,
    dead: 1,
    gameOver: 2,
}

project.init = (texture) => {
    let fire = new Key("Space")
    let fireMissile = new Key("KeyX")

    let asteroidImages = new ImageArray(texture.asteroid, 8, 4
        , 0.5, 0.5, 1.5, 1.5)

    let gunfireTemplate = {
        layer: shipLayer,
        image: new Img(texture.gunfire, undefined, undefined, undefined, undefined, 0, 0.5),
        size: 1,
        visible: false,
    }

    template = {
        ship: {
            image: new Img(texture.ship, 0, 0, undefined, undefined
                , 0.5, 0.5, 1.75, 1.75),
            angle: 0,
            speed: 0,
        },

        explosion: {
            layer: explosions,
            images: new ImageArray(texture.explosion, 4, 4, 0.5, 0.5, 2, 2),
            angle: new Rnd(360),
            animationSpeed: 16
        },

        // asteroids

        explodingAsteroid: {
            layer: asteroids,
            images: new ImageArray(texture.explodingAsteroid, 8, 4
                , 0.5, 0.5, 1.5, 1.5),
            size: 2,
            speed: 5,
            //angle: new Rnd(rad(-10), rad(10)),
            animationSpeed: 24.0,
            score: 250,
            parameters: {
                explosionSize: 5,
                hp: 50,
            },
        },

        asteroidType: {
            big: {
                layer: asteroids,
                images: asteroidImages,
                size: 3,
                angle: new Rnd(-15, 15),
                speed: new Rnd(2, 3),
                animationSpeed: new Mul(new Rnd(12, 20), rnds),
                rotationSpeed: new Rnd(-180, 180),
                score: 100,
                parameters: {
                    hp: 300,
                }
            },

            medium: {
                layer: asteroids,
                images: asteroidImages,
                size: 2,
                angle: new Rnd(-15, 15),
                speed: new Rnd(2.5, 4),
                animationSpeed: new Mul(new Rnd(16, 25), rnds),
                rotationSpeed: new Rnd(-180, 180),
                score: 200,
                parameters: {
                    hp: 200,
                }
            },

            small: {
                layer: asteroids,
                images: asteroidImages,
                size: 1,
                angle: new Rnd(-15, 15),
                speed: new Rnd(3, 5),
                animationSpeed: new Mul(new Rnd(20, 30), rnds),
                rotationSpeed: new Rnd(-180, 180),
                score: 300,
                parameters: {
                    hp: 100,
                },
            },
        },

        // weapons

        weapon: {

            // fireball

            fireball: {
                bullet: {
                    layer: bullets,
                    images: new ImageArray(texture.fireball, 1, 16
                        , 43 / 48, 5.5 / 12, 5.25, 1.5),
                    size: 0.3,
                    speed: 15,
                    //angle: new Rnd(rad(-10), rad(10)),
                    animationSpeed: 16.0,
                    parameters: {
                        damage: 100,
                        explosionSize: 0.8,
                    }
                },

                controller: new Turbo(fire, 0.15),
            },

            // double barreled turret

            turret: {
                sprite: new Sprite(new Img(texture.turret), 0, 0, 2, 2),
                barrelEnd: [new Point(0.5, 0.4), new Point(0.5, -0.4)],
                gunfire: [Sprite.createFromTemplate(gunfireTemplate), Sprite.createFromTemplate(gunfireTemplate)],
                controller: new Turbo(fire, 0.10),

                bullet: {
                    layer: bullets,
                    image: new Img(texture.bullet),
                    size: 0.12,
                    speed: 30,
                    parameters: {
                        damage: 50,
                        explosionSize: 0.5,
                    }
                },

                bonus: new Sprite(new Img(texture.turretBonus)),
                probability: 0.1,
                ammo: new Num(),
                bonusAmmo: 50,
                maxAmmo: 100,
                gunfireTime: 0.05
            },

            // missile launcher

            launcher: {
                missile: {
                    class: "template",
                    layer: bullets,
                    image: new Img(texture.missile, undefined, undefined, undefined, undefined
                        , 0.95, 0.5, 10, 3),
                    size: 0.15,
                    speed: 15,
                    parameters: {
                        damage: 300,
                        explosionSize: 5,
                    },
                },

                bonus: new Sprite(new Img(texture.missileBonus)),
                probability: 0.1,
                ammo: new Num(3),
                maxAmmo: 8,

                controller: new Turbo(fireMissile, 0.5),
            }

        },
    }

    let type = template.asteroidType
    type.big.pieces = [
        {
            type: type.medium,
            angle: 0,
        },
        {
            type: type.small,
            angle: 60,
        },
        {
            type: type.small,
            angle: -60,
        },
    ]
    type.medium.pieces = [
        {
            type: type.small,
            angle: 60,
        },
        {
            type: type.small,
            angle: -60,
        },
    ]
    type.small.pieces = []

    // ship
    
    shipSprite = Sprite.createFromTemplate(template.ship)
    invulnerabilityAction = new AnimateOpacity(shipSprite, new Cos(0.2, 0.5, 0, 0.5))
    shipLayer.add(shipSprite)

    let flameImages = new ImageArray(texture.flame, 3, 3, 0.5, 1)
    flameSprite = Sprite.create(shipLayer, flameImages.image(0), -0.6, 0
        , 1, 1, undefined, rad(-90))

    // weapon

    startingWeapon = template.weapon.fireball
    gun = new Point(1, 0)
    let turret = template.weapon.turret
    turret.sprite.visible = false
    shipLayer.add(turret.sprite)

    // gui

    defaultCanvas()

    bounds = new Box(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)

    let hudArea = new Box(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    let scoreLabel = new Label(hudArea, [score], Align.left, Align.top, "Z8")
    let levelLabel = new Label(hudArea, [loc("level"), level], Align.center, Align.top)
    let livesLabel = new Label(hudArea, [lives], Align.right, Align.top, "I1", texture.ship)
    let missilesLabel = new Label(hudArea, [template.weapon.launcher.ammo], Align.left, Align.bottom, "I1", texture.missileIcon)

    messageLabel = new Label(hudArea, [""], Align.center, Align.center)
    hud = new Layer(scoreLabel, levelLabel, livesLabel, messageLabel, missilesLabel)
    hud.add(new Label(hudArea, [turret.ammo], Align.right, Align.bottom, "I10", texture.ammoIcon))

    // other

    currentCanvas.background = "rgb(9, 44, 84)"
    project.scene.add(bullets, asteroids, bonuses, particles, shipLayer, explosions, hud)

    project.actions = [
        new LoopArea(shipSprite, bounds),
        new Animate(flameSprite, flameImages, 16),
        new AnimateSize(flameSprite, new Cos(0.1, 0.1, 0, 0.95)),
        new Constraint(flameSprite, shipSprite),

        new RemoveIfOutside(bullets, bounds),

        new LoopArea(asteroids, bounds),

        new Constraint(gun, shipSprite),
        new Constraint(turret.barrelEnd[0], turret.sprite),
        new Constraint(turret.barrelEnd[1], turret.sprite),

        new Move(project.scene),
    ]

    initUpdate()
}