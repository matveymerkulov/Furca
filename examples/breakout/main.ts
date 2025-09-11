import {Key} from "../../src/key.js"
import {project, tileMap, tileSet} from "../../src/project.js"
import {loadData} from "./data.js"
import {Sprite} from "../../src/sprite.js"
import {Img} from "../../src/image.js"
import {registry} from "./registry.js"
import {ShapeType} from "../../src/vector_shape.js"
import {emptyTile, TileMap} from "../../src/tile_map.js"
import {NinePatch} from "../../src/nine_patch.js"
import {Layer} from "../../src/layer.js"
import {PopEffect, PopEffectType} from "./pop_effect.js"
import {Box} from "../../src/box.js"
import {Label} from "../../src/gui/label.js"
import {Num} from "../../src/variable/number.js"
import {Align, apsk, defaultCanvas, defaultFontSize, mouse, play, texture} from "../../src/system.js"
import {atan2, clamp, cos, floor, rad, sin} from "../../../RuWebQuest 2/src/functions.js"
import {AngularSprite} from "../../src/angular_sprite.js"
import {VectorSprite} from "../../src/vector_sprite.js"
import { Shape } from "../../src/shape.js"
import {Action} from "../../src/actions/action.js";

project.textures = ["blocks.png"]
project.sounds = ["collision1.mp3", "collision2.mp3", "collision3.mp3", "collision4.mp3", "ball_lost.ogg"
            , "game_over.mp3", "win.ogg"]

export let minPaddleX: number, maxPaddleX: number, paddleY: number, initialBallY: number, level: TileMap
export let fx: Action[] = []

project.init = () => {
    const key = new Key("LMB");

    loadData()

    defaultCanvas(40,24)

    const ballImage = new Img(texture["blocks"], 3 * 32, 13 * 32, 32, 32);

    const blocksLeft = new Num()
    const score = new Num()
    const lives = new Num(3)

    const hud = new Box(0, 1, tileMap["blocks"].width - 3, tileMap["blocks"].height - 1)
    const blocksLeftLabel = new Label(hud, [""/*"Blocks left: ", blocksLeft*/], defaultFontSize
        , Align.left, Align.top)
    const messageLabel = new Label(hud, [""], defaultFontSize, Align.center, Align.center)
    const scoreLabel = new Label(hud, [score], defaultFontSize, Align.center, Align.top, "Z8")
    const livesLabel = new Label(hud, [lives], defaultFontSize, Align.right, Align.top, "I1"
        , ballImage, 0.5)

    const tileSetWidth = 4

    // new Img(texture.blocks, 0, 192, 96, 32, 0.5, 1.0, 1.0, 0.5)
    const paddle = new AngularSprite(new NinePatch(new Img(texture["blocks"], 0, 0, 96, 32), 16
        , 80, 8, 24), 0, 10.5, 5, 1, ShapeType.box)

    const BallStatus = {
        onPaddle: 0,
        rolling: 1,
        appearing: 2,
        gameOver: 3
    }

    const ball = new AngularSprite(ballImage, 0, 9.25, 0.5, 0.5, ShapeType.circle)
    let ballStatus = BallStatus.onPaddle

    tileSet["blocks"].setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 0, tileSetWidth * 14)

    project.scene.add(level, fx, paddle, ball, blocksLeftLabel, livesLabel, messageLabel, scoreLabel)

    const horizontalBlocks = tileSetWidth * 4
    const verticalBlocks = tileSetWidth * 8
    const singleBlocks = tileSetWidth * 12

    function initPaddleSize(width, height) {
        paddle.setSize(width, height)
        let d = level.cellWidth + paddle.halfWidth
        minPaddleX = -level.halfWidth + d
        maxPaddleX = level.halfWidth - d
        paddleY = level.halfHeight - paddle.halfHeight
        initialBallY = paddle.top - ball.halfHeight
    }

    function initLevel() {
        level = tileMap["blocks"].copy()
        ball.speed = registry.ball.speed
        ball.angle = registry.ball.angle
        ball.size = registry.ball.size
        ballStatus = BallStatus.onPaddle

        lives.value = 3
        score.value = 0
        messageLabel.items[0] = ""

        project.scene.replace(0, level)

        blocksLeft.value = 0
        level.processTilesByPos((column, row, tileNum) => {
            if(tileNum >= horizontalBlocks) {
                blocksLeft.increment()
            }
        })

        initPaddleSize(registry.paddle.width, registry.paddle.height)
    }
    initLevel()

    const collisionType = {
        none: 0,
        horizontal: 1,
        vertical: 2,
    }

    project.update = () => {
        function removeTile(column, row, snd) {
            let tileNum = level.tileByPos(column, row)
            let dx = 0, dy = 0

            if(tileNum < horizontalBlocks) {
                play(snd)
                return
            } else if(tileNum < verticalBlocks) {
                dx = 1
                if (tileNum % 2 === 1) {
                    column -= 1
                }
            } else if(tileNum < singleBlocks) {
                dy = 1
                if(floor(tileNum / tileSetWidth) % 2 === 1) {
                    row -= 1
                }
            }
            blocksLeft.decrement(1 + dx + dy)
            score.increment((2 - dx - dy)* 100)

            if(blocksLeft.value <= 0) {
                messageLabel.items[0] = "ВЫ ПОБЕДИЛИ!"
                ballStatus = BallStatus.gameOver
                play("win")
            }

            let sprite = level.tileAngularSpriteByPos(column, row)
            sprite.setPosition(sprite.x + 0.5 * dx, sprite.y + 0.5 * dy)
            sprite.setSize(1 + dx, 1 + dy)

            fx.add(new PopEffect(sprite, 0.5, PopEffectType.disappear))

            level.setTileByPos(column, row, emptyTile)
            level.setTileByPos(column + dx, row + dy, emptyTile)

            play("collision1")
        }

        if(ballStatus !== BallStatus.gameOver) {
            paddle.setPosition(clamp(mouse.x, minPaddleX, maxPaddleX), paddleY)
        }

        if(ballStatus === BallStatus.rolling) {
            let dx = cos(ball.angle) * ball.speed * apsk
            let dy = sin(ball.angle) * ball.speed * apsk
            let angleChanged = collisionType.none

            ball.x += dx
            level.collisionWithSprite(ball, (collisionSprite: Sprite, tileNum: number, x: number, y: number) => {
                ball.pushFromSprite(collisionSprite)
                angleChanged = collisionType.horizontal
                removeTile(x, y, "collision2")
            })

            ball.y += dy
            level.collisionWithSprite(ball, (collisionSprite: Sprite, tileNum: number, x: number, y: number) => {
                ball.pushFromSprite(collisionSprite)
                angleChanged = collisionType.vertical
                removeTile(x, y, "collision4")
            })

            if(angleChanged === collisionType.horizontal) {
                ball.angle = rad(180) - ball.angle
            } else if(angleChanged === collisionType.vertical) {
                ball.angle = -ball.angle
            }

            if(sin(ball.angle) > 0 && ball.collidesWithSprite(paddle)) {
                ball.pushFromSprite(paddle)
                ball.angle = atan2(-paddle.height, ball.x - paddle.x)
                play("collision3")
            }

            if(ball.top > paddle.bottom) {
                if(lives.value <= 0) {
                    messageLabel.items[0] = "ИГРА ОКОНЧЕНА"
                    ballStatus = BallStatus.gameOver
                    ball.hide()
                    play("game_over")
                    return
                }

                play("ball_lost")

                lives.decrement()

                let effect = new PopEffect(ball, 0.5, PopEffectType.appear)
                effect.next = () => {
                    ballStatus = BallStatus.onPaddle
                }
                fx.add(effect)

                ball.angle = registry.ball.angle
                ballStatus = BallStatus.appearing
            }
        } else {
            ball.setPosition(paddle.x, initialBallY)
            if(ballStatus === BallStatus.onPaddle && key.keyWasPressed) {
                ballStatus = BallStatus.rolling
            } else if(ballStatus === BallStatus.gameOver && key.keyWasPressed) {
                ballStatus = BallStatus.onPaddle
                initLevel()
                ball.show()
            }
        }
    }
}