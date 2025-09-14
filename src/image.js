import {Renderable} from "./renderable.js"
import {Shape} from "./shape.js"
import {ctx} from "./canvas.js"
import {showCollisionShapes} from "./input.js"
import {texture} from "./system.js"
import {NinePatch} from "./nine_patch.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)

export class Img extends Renderable {
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
    }

    static create(template) {
        if(template === undefined) return

        if(template.class === "NinePatch") {
            return NinePatch.create(template)
        }

        let object = template.object

        if(object === undefined) {
            object = new Img(texture[template.texture], template.x, template.y, template.width, template.height
                , template.xMul, template.yMul, template.widthMul, template.heightMul)
            template.object = object
        }

        return object
    }

    drawResized(sx, sy, swidth, sheight, shapeType) {
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, sx, sy, swidth, sheight)
    }

    drawRotated(sx, sy, swidth, sheight, shapeType, angle, flipped) {
        let newWidth = swidth * this.widthMul
        let newHeight = sheight * this.heightMul
        let newX = -newWidth * this.xMul
        let newY = -newHeight * this.yMul

        ctx.save()
        ctx.translate(sx, sy)
        if(flipped) ctx.scale(-1,1)
        ctx.rotate(angle)
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, newX, newY, newWidth, newHeight)
        ctx.restore()

        if(showCollisionShapes) {
            collisionShape.drawResized(sx - swidth * 0.5, sy - sheight * 0.5, swidth, sheight, shapeType)
        }
    }
}

