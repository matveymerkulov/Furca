import Key from "../../src/key.js"
import {project, tileMap, tileSet} from "../../src/project.js"
import {loadData} from "./data.js"
import Sprite from "../../src/sprite.js"
import Img from "../../src/image.js"
import {apsk, clamp, defaultCanvas, mouse} from "../../src/system.js"
import {currentCanvas} from "../../src/canvas.js"
import {ShapeType} from "../../src/shape_type.js"
import {registry} from "./registry.js"

project.getAssets = () => {
    return {
        texture: {
            blocks: "blocks.png",
            colors: "colors.png",
        },
        sound: {
        }
    }
}

let saveKey = new Key("KeyS")
let loadKey = new Key("KeyL")

export let fieldWidth, fieldHeight, minPaddleX, maxPaddleX, paddleY, initialBallY

project.init = (texture) => {
    loadData(texture)

    defaultCanvas()
    currentCanvas.size = 50

    let paddle = new Sprite(new Img(texture.blocks, 0, 192, 96, 32), 0, 10.5, 3, 1, ShapeType.box)
    let ball = new Sprite(new Img(texture.blocks, 96, 160, 32, 32), 0, 9.25, 0.5, 0.5, ShapeType.circle)
    let ballIsActive = true

    tileSet.blocks.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 0, 4 * 6)

    project.scene.add(tileMap.blocks, tileMap.colors, paddle, ball)

    function initLevel() {
        fieldWidth = tileMap.blocks.width
        fieldHeight = tileMap.blocks.height
        let d = tileMap.blocks.cellWidth + 0.5 * paddle.width
        minPaddleX = -0.5 * fieldWidth + d
        maxPaddleX = 0.5 * fieldWidth - d
        paddleY = 0.5 * (fieldHeight - paddle.height)
        ball.dx = registry.initialBallSpeed
        ball.dy = -registry.initialBallSpeed
        ball.size = registry.ballSize
        initialBallY = paddle.topY - 0.5 * ball.height
    }
    initLevel()

    project.update = () => {
        paddle.setPosition(clamp(mouse.x, minPaddleX, maxPaddleX), paddleY)
        if(ballIsActive) {
            ball.x += ball.dx * apsk
            tileMap.blocks.collisionWithSprite(ball, (shape, tileNum, x, y) => {
                ball.pushFromSprite(shape)
                ball.dx = -ball.dx
            })

            ball.y += ball.dy * apsk
            tileMap.blocks.collisionWithSprite(ball, (shape, tileNum, x, y) => {
                ball.pushFromSprite(shape)
                ball.dy = -ball.dy
            })

            if(ball.dy > 0 && ball.collidesWithSprite(paddle)) {
                ball.dy = -ball.dy
            }

        } else {
            ball.setPosition(paddle.x, initialBallY)
        }
    }
}