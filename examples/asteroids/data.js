import {Num} from "../../src/variable/number.js"
import {Box} from "../../src/box.js"
import {currentCanvas} from "../../src/canvas.js"
import {Label} from "../../src/gui/label.js"
import {Align, defaultCanvas, defaultFontSize, loc, texture} from "../../src/system.js"
import {Img} from "../../src/image.js"
import {ImageArray} from "../../src/image_array.js"
import {Layer} from "../../src/layer.js"
import {Key} from "../../src/key.js"
import {LoopArea} from "../../src/actions/sprite/loop_area.js"
import {Move} from "../../src/actions/sprite/move.js"
import {Animate} from "../../src/actions/sprite/animate.js"
import {Constraint} from "../../src/constraint.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import {project} from "../../src/project.js"
import {initUpdate} from "./code.js"
import {Rnd} from "../../src/function/rnd.js"
import {rnds} from "../../src/function/random_sign.js"
import {Mul} from "../../src/function/mul.js"
import {Turbo} from "./turbo.js"
import {Point} from "../../src/point.js"
import {Cos} from "../../src/function/cos.js"
import {AnimateSize} from "../../src/actions/sprite/animate_size.js"
import {rad} from "../../src/functions.js"
import {Blink} from "../../src/actions/sprite/blink.js"
import {AngularSprite} from "../../src/angular_sprite.js"

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

project.textures = ["textures/asteroid.png", "textures/explosion.png", "textures/fireball.png", "textures/flame.png",
    "textures/flame_particle.png", "textures/ship.png",]
project.sounds = ["sounds/death.mp3", "sounds/explosion.mp3", "sounds/extra_life.mp3", "sounds/fireball.mp3",
    "sounds/flame.mp3", "sounds/game_over.mp3", "sounds/music.mp3", "sounds/new_level.mp3"]

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

project.init = () => {
    let fire = new Key("Space")

    let asteroidImages = {
        texture: "asteroid",
        columns: 8,
        rows: 4,
        widthMul: 1.5,
        heightMul: 1.5,
    }

    template = {
        ship: {
            image: {
                texture: "ship",
                widthMul: 1.75,
                heightMul: 1.75,
            },
            angle: 0,
            speed: 0,
        },

        explosion: {
            images: {
                texture: "explosion",
                rows: 4,
                columns: 4,
                widthMul: 2,
                heightMul: 2,
            },
            angle: new Rnd(360),
            animationSpeed: 16
        },

        // asteroids

        asteroidType: {
            big: {
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
                    images: {
                        texture: "fireball",
                        columns: 1,
                        rows: 16,
                        xMul: 43 / 48,
                        yMul: 5.5 / 12,
                        widthMul: 5.25,
                        heightMul: 1.5,
                    },
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
    
    shipSprite = AngularSprite.create(template.ship, shipLayer)
    invulnerabilityAction = new Blink(shipSprite, new Cos(0.2, 0.5, 0, 0.5))

    let flameImages = new ImageArray(texture["flame"], 3, 3, 0.5, 1)
    flameSprite = new AngularSprite(flameImages.image(0), -0.6, 0
        , 1, 1, undefined, rad(-90), 0)
    shipLayer.add(flameSprite)

    // weapon

    startingWeapon = template.weapon.fireball
    gun = new Point(1, 0)

    // gui

    defaultCanvas(16, 16)

    bounds = new Box(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)

    let hudArea = new Box(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    let scoreLabel = new Label(hudArea, [score], defaultFontSize, Align.left, Align.top, "Z8")
    let levelLabel = new Label(hudArea, [loc("level"), level], defaultFontSize, Align.center, Align.top)
    let livesLabel = new Label(hudArea, [lives], defaultFontSize, Align.right, Align.top, "I1", new Img(texture.ship))

    messageLabel = new Label(hudArea, [""], defaultFontSize, Align.center, Align.center)
    hud = new Layer(scoreLabel, levelLabel, livesLabel, messageLabel)

    // other

    currentCanvas.background = "rgb(9, 44, 84)"
    project.scene.add(bullets, asteroids, bonuses, particles, shipLayer, explosions, hud)

    project.actions.push(
        new LoopArea(shipSprite, bounds),
        new Animate(flameSprite, flameImages, 16),
        new AnimateSize(flameSprite, new Cos(0.1, 0.1, 0, 0.95)),
        new Constraint(flameSprite, shipSprite),

        new Constraint(gun, shipSprite),

        new RemoveIfOutside(bullets, bounds),

        new LoopArea(asteroids, bounds),

        new Move(project.scene),
    )

    initUpdate()
}