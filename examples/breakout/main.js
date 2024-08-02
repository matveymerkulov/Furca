import Key from "../../src/key.js"
import {apsk, atan2, clamp, cos, defaultCanvas, mouse, play, rad, sin} from "../../src/system.js"
import {project, tileMap, tileSet} from "../../src/project.js"
import {loadData} from "./data.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import {currentCanvas} from "../../src/canvas.js"
import {registry} from "./registry.js"
import Shape, {ShapeType} from "../../src/shape.js"
import {emptyTile} from "../../src/tile_map.js"
import {NinePatch} from "../../src/nine_patch.js"

project.getAssets = () => {
    return {
        texture: {
            blocks: "blocks.png",
            colors: "colors.png",
        },
        sound: {
            collision1: "collision1.mp3",
            collision2: "collision2.mp3",
        }
    }
}

export let fieldHalfWidth, fieldHalfHeight, minPaddleX, maxPaddleX, paddleY, initialBallY

project.init = (texture) => {
    loadData(texture)

    defaultCanvas()
    currentCanvas.size = 40

    // new Img(texture.blocks, 0, 192, 96, 32, 0.5, 1.0, 1.0, 0.5)
    let paddle = new Sprite(new NinePatch(new Img(texture.blocks, 0, 0, 96, 32), 16
        , 80, 8, 24), 0, 10.5, 5, 1, ShapeType.box)
    let ball = new Sprite(new Img(texture.blocks, 96, 160, 32, 32), 0, 9.25, 0.5, 0.5, ShapeType.circle)
    let ballIsActive = true

    tileMap.colors.operation = "color"
    tileSet.blocks.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 0, 4 * 6)

    project.scene.add(tileMap.blocks, tileMap.colors, paddle, ball)

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

    project.update = () => {
        function removeTile(x, y) {
            let tileNum = tileMap.blocks.posTile(x, y)
            if(tileNum < 16) {
                play(collision2)
                return
            }
            tileMap.blocks.setPosTile(x, y, emptyTile)
            if(tileNum === registry.leftTilePart) {
                tileMap.blocks.setPosTile(x + 1, y, emptyTile)
            } else {
                tileMap.blocks.setPosTile(x - 1, y, emptyTile)
            }
            play(collision1)
        }

        const collisionType = {
            none: Symbol("none"),
            horizontal: Symbol("horizontal"),
            vertical: Symbol("vertical"),
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
                ball.angle = atan2(-paddle.halfHeight, ball.x - paddle.x)
                project.sound.collision1.play()
            }
        } else {
            ball.setPosition(paddle.x, initialBallY)
        }
    }
}