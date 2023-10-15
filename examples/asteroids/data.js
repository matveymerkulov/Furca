import NumericVariable from "../../variable/number.js"
import Shape from "../../shape.js"
import {currentCanvas} from "../../canvas.js"
import Label from "../../gui/label.js"
import {align, loc, rad} from "../../system.js"
import Sprite from "../../sprite.js"
import Img from "../../image.js"
import ImageArray from "../../image_array.js"
import Layer from "../../layer.js"
import Key from "../../key.js"
import LoopArea from "../../actions/sprite/loop_area.js"
import Move from "../../actions/sprite/move.js"
import Animate from "../../actions/sprite/animate.js"
import Constraint from "../../constraint.js"
import SetBounds from "../../actions/sprite/set_bounds.js"
import ExecuteActions from "../../actions/sprite/execute_actions.js"
import {project} from "../../project.js"
import {initUpdate} from "./code.js"
import Rnd from "../../function/rnd.js"
import {rnds} from "../../function/random_sign.js"
import Mul from "../../function/mul.js"
import Turbo from "../../actions/turbo.js"
import Point from "../../point.js"
import AnimateOpacity from "../../actions/sprite/blink.js"
import Cos from "../../function/cos.js"
import AnimateSize from "../../actions/sprite/animate_size.js"

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

project.key = {
    left: new Key("left", "ArrowLeft"),
    right: new Key("right", "ArrowRight"),
    forward: new Key("forward", "ArrowUp"),
    fire: new Key("fire", "Space"),
    fireMissile: new Key("fire missile", "KeyX"),
    continue: new Key("continue", "Enter"),
    pause: new Key("pause", "KeyP"),
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

project.init = (texture) => {
    project.registry = {
        startingLives: 3,
        ship: {
            acceleration: 25,
            deceleration: 15,
            accelerationLimit: 7.5,
            angularSpeed: 180,
        },
        template: {},
        state: {
            alive: 0,
            dead: 1,
            gameOver: 2,
        },
        invulnerable: false,
        nextLifeBonus: 25000,
        levelBonus: 1000,
        invulnerabilityTime: 2,
    }
    let val = project.registry
    let template = val.template

    // variables

    val.score = new NumericVariable()
    val.lives = new NumericVariable(val.startingLives)
    val.level = new NumericVariable()

    // layers

    val.bullets = new Layer()
    val.shipLayer = new Layer()
    val.asteroids = new Layer()
    val.bonuses = new Layer()
    val.explosions = new Layer()

    // asteroids

    val.asteroidImages = new ImageArray(texture.asteroid, 8, 4
        , 0.5, 0.5, 1.5, 1.5)
    val.asteroidType = {
        big: {
            layer: val.asteroids,
            images: val.asteroidImages,
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
            layer: val.asteroids,
            images: val.asteroidImages,
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
            layer: val.asteroids,
            images: val.asteroidImages,
            size: 1,
            angle: new Rnd(-15, 15),
            speed: new Rnd(3, 5),
            animationSpeed: new Mul(new Rnd(20, 30), rnds),
            rotationSpeed: new Rnd(-180, 180),
            score: 300,
            parameters: {
                hp: 100,
            }
        },
    }
    let type = val.asteroidType

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

    // exploding asteroid

    template.explodingAsteroid = {
        layer: val.asteroids,
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
        }
    }

    // ship

    template.ship = {
        image: new Img(texture.ship, 0, 0, undefined, undefined
            , 0.5, 0.5, 1.75, 1.75),
        angle: 0,
        speed: 0,
    }

    val.shipSprite = Sprite.createFromTemplate(template.ship)
    val.invulnerabilityAction = new AnimateOpacity(val.shipSprite, new Cos(0.2, 0.5, 0, 0.5))
    val.shipLayer.add(val.shipSprite)

    val.flameImages = new ImageArray(texture.flame, 3, 3, 0.5, 1)
    val.flameSprite = Sprite.create(val.shipLayer, val.flameImages._images[0], -0.6, 0
        , 1, 1, rad(-90))

    // explosions

    val.explosionImages = new ImageArray(texture.explosion, 4, 4
        , 0.5, 0.5, 2, 2)

    template.explosion = {
        layer: val.explosions,
        images: val.explosionImages,
        angle: new Rnd(360),
        animationSpeed: 16
    }

    // gui

    val.bounds = new Shape(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)

    let hudArea = new Shape(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    let scoreLabel = new Label(hudArea, [val.score], align.left, align.top, "Z8")
    let levelLabel = new Label(hudArea, [loc("level"), val.level], align.center, align.top)
    let livesLabel = new Label(hudArea, [val.lives], align.right, align.top, "I1", texture.ship)

    val.messageLabel = new Label(hudArea, [""], align.center, align.center)
    val.hud = new Layer(scoreLabel, levelLabel, livesLabel, val.messageLabel)

    // weapons

    template.weapon = {}
    let weapon = template.weapon
    weapon.gun = new Point(1, 0)

    // fireball

    weapon.fireball = {
        bullet: {
            layer: val.bullets,
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

        controller: new Turbo(project.key.fire, 0.15),
    }
    val.currentWeapon = weapon.fireball

    // double barreled turret

    let gunfireTemplate = {
        layer: val.shipLayer,
        image: new Img(texture.gunfire, undefined, undefined, undefined, undefined, 0, 0.5),
        size: 1,
        visible: false,
    }

    weapon.turret = {
        sprite: new Sprite(new Img(texture.turret), 0, 0, 2, 2),
        barrelEnd: [new Point(0.5, 0.4), new Point(0.5, -0.4)],
        gunfire: [Sprite.createFromTemplate(gunfireTemplate), Sprite.createFromTemplate(gunfireTemplate)],
        controller: new Turbo(project.key.fire, 0.10),

        bullet: {
            layer: val.bullets,
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
        ammo: new NumericVariable(),
        bonusAmmo: 50,
        maxAmmo: 100,
        gunfireTime: 0.05
    }
    let turret = weapon.turret

    turret.sprite.visible = false
    val.shipLayer.add(turret.sprite)

    val.hud.add(new Label(hudArea, [turret.ammo], align.right, align.bottom, "I10", texture.ammoIcon))

    // missile launcher

    weapon.launcher = {
        missile: {
            class: "template",
            layer: val.bullets,
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
        ammo: new NumericVariable(3),
        maxAmmo: 8,

        controller: new Turbo(project.key.fireMissile, 0.5),
    }

    val.hud.add(new Label(hudArea, [weapon.launcher.ammo], align.left, align.bottom, "I1", texture.missileIcon))

    // other

    project.background = "rgb(9, 44, 84)"
    project.scene = [
        val.bullets,
        val.asteroids,
        val.bonuses,
        val.shipLayer,
        val.explosions,
        val.hud
    ]

    project.actions = [
        new LoopArea(val.shipSprite, val.bounds),
        new Move(val.shipSprite),
        new Animate(val.flameSprite, val.flameImages, 16),
        new AnimateSize(val.flameSprite, new Cos(0.1, 0.1, 0, 0.95)),
        new Constraint(val.flameSprite, val.shipSprite),
        new ExecuteActions(val.shipLayer),

        new SetBounds(val.bullets, val.bounds),
        new Move(val.bullets),
        new ExecuteActions(val.bullets),

        new LoopArea(val.asteroids, val.bounds),
        new Move(val.asteroids),
        new ExecuteActions(val.asteroids),

        new Constraint(weapon.gun, val.shipSprite),
        new Constraint(turret.barrelEnd[0], turret.sprite),
        new Constraint(turret.barrelEnd[1], turret.sprite),

        new ExecuteActions(val.explosions),
        new ExecuteActions(val.bonuses),
    ]

    initUpdate()
}