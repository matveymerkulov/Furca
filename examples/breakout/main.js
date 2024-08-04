import Key from "../../src/key.js"
import {apsk, atan2, clamp, cos, defaultCanvas, mouse, play, rad, sin} from "../../src/system.js"
import {project, tileMap, tileSet} from "../../src/project.js"
import {loadData} from "./data.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../../src/canvas.js"
import {registry} from "./registry.js"
import Shape, {ShapeType} from "../../src/shape.js"
import {emptyTile} from "../../src/tile_map.js"
import {NinePatch} from "../../src/nine_patch.js"
import {Action} from "../../src/actions/action.js"
import Layer from "../../src/layer.js"

project.getAssets = () => {
    return {
        texture: {
            blocks: "blocks.png",
            colors: "colors.png",
        },
        sound: {
            collision1: "collision1.mp3",
            collision2: "collision2.mp3",
            collision3: "collision3.mp3",
            ballLost: "death.ogg",
        }
    }
}

export let fieldHalfWidth, fieldHalfHeight, minPaddleX, maxPaddleX, paddleY, initialBallY

project.init = (texture) => {
    let key = new Key("LMB")

    loadData(texture)

    defaultCanvas()
    currentCanvas.size = 40

    // new Img(texture.blocks, 0, 192, 96, 32, 0.5, 1.0, 1.0, 0.5)
    let paddle = new Sprite(new NinePatch(new Img(texture.blocks, 0, 0, 96, 32), 16
        , 80, 8, 24), 0, 10.5, 5, 1, ShapeType.box)
    let ball = new Sprite(new Img(texture.blocks, 3 * 32, 13 * 32, 32, 32), 0, 9.25, 0.5, 0.5, ShapeType.circle)
    let ballIsActive = false

    tileSet.blocks.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 0, 4 * 14)

    let sprites = new Layer()

    project.scene.add(tileMap.blocks, sprites, paddle, ball)

    function initLevel() {
        fieldHalfWidth = tileMap.blocks.halfWidth
        fieldHalfHeight = tileMap.blocks.halfHeight
        let d = tileMap.blocks.cellWidth + paddle.halfWidth
        minPaddleX = -fieldHalfWidth + d
        maxPaddleX = fieldHalfWidth - d
        paddleY = fieldHalfHeight - paddle.halfHeight
        ball.speed = registry.initialBallSpeed
        ball.angle = rad(-45)
        ball.size = registry.ballSize
        initialBallY = paddle.topY - ball.halfHeight
    }
    initLevel()

    let collision1 = project.sound.collision1
    let collision2 = project.sound.collision2

    const collisionType = {
        none: Symbol("none"),
        horizontal: Symbol("horizontal"),
        vertical: Symbol("vertical"),
    }

    project.update = () => {
        function removeTile(column, row) {
            let tileNum = tileMap.blocks.tileByPos(column, row)
            let dx = 0, dy = 0
            if(tileNum < 16) {
                play(collision2)
                return
            } else if(tileNum < 32) {
                dx = 1
                if (tileNum % 2 === 1) {
                    column -= 1
                }
            } else if(tileNum < 48) {
                dy = 1
                if(Math.floor(tileNum / 4) % 2 === 1) {
                    row -= 1
                }
            }

            tileMap.blocks.setTileByPos(column, row, emptyTile)
            tileMap.blocks.setTileByPos(column + dx, row + dy, emptyTile)
            play(collision1)
        }

        paddle.setPosition(clamp(mouse.x, minPaddleX, maxPaddleX), paddleY)

        if(ballIsActive) {
            let dx = cos(ball.angle) * ball.speed * apsk
            let dy = sin(ball.angle) * ball.speed * apsk
            let angleChanged = collisionType.none

            ball.x += dx
            tileMap.blocks.collisionWithSprite(ball, (collisionSprite, tileNum, x, y) => {
                ball.pushFromSprite(collisionSprite)
                angleChanged = collisionType.horizontal
                removeTile(x, y)
            })

            ball.y += dy
            tileMap.blocks.collisionWithSprite(ball, (collisionSprite, tileNum, x, y) => {
                ball.pushFromSprite(collisionSprite)
                angleChanged = collisionType.vertical
                removeTile(x, y)
            })

            if(angleChanged === collisionType.horizontal) {
                ball.angle = rad(180) - ball.angle
            } else if(angleChanged === collisionType.vertical) {
                ball.angle = -ball.angle
            }

            if(sin(ball.angle) > 0 && ball.collidesWithSprite(paddle)) {
                ball.pushFromSprite(paddle)
                ball.angle = atan2(-paddle.height, ball.x - paddle.x)
                play(project.sound.collision3)
            }

            if(ball.topY > paddle.bottomY) {
                play(project.sound.ballLost)
                //ball.hide()

                ballIsActive = false
            }
        } else {
            ball.setPosition(paddle.x, initialBallY)
            ball.angle = rad(-45)
            if(key.wasPressed) {
                ballIsActive = true
            }
        }
    }
}



class ColoredSprite extends Sprite {
    #color

    constructor(image, x, y, width, height, color) {
        super(image, x, y, width, height, ShapeType.box)
        this.#color = color
    }

    draw() {
        let x = xToScreen(this.x)
        let y = yToScreen(this.y)
        let width = distToScreen(this.width)
        let height = distToScreen(this.height)
        this.image.drawResized(x, y, width, height)

        ctx.globalCompositeOperation = "color"
        ctx.fillStyle = this.#color
        ctx.fillRect(x, y, width, height)

        ctx.globalCompositeOperation = "source-over"
    }
}