import {ctx, showCollisionShapes} from "./system.js"
import {Renderable} from "./renderable.js"
import Shape from "./shape.js"

let collisionShape = new Shape("rgba(255, 0, 255, 128)")

export default class Img extends Renderable {
    constructor(texture, x = 0, y = 0, width = texture.width, height = texture.height
        , xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
        super()
        this.texture = texture
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.xMul = xMul
        this.yMul = yMul
        this.widthMul = widthMul
        this.heightMul = heightMul
        this.visible = true
    }

    drawResized(sx, sy, swidth, sheight, shapeType) {
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, sx, sy, swidth, sheight)
    }

    drawRotated(sx, sy, swidth, sheight, shapeType, angle) {
        let newWidth = swidth * this.widthMul
        let newHeight = sheight * this.heightMul
        let newX = -newWidth * this.xMul
        let newY = -newHeight * this.yMul

        ctx.save()
        ctx.translate(sx, sy)
        ctx.rotate(angle)
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, newX, newY, newWidth, newHeight)
        ctx.restore()

        if(showCollisionShapes) {
            collisionShape.drawResized(sx, sy, swidth, sheight, shapeType)
        }
    }
}

