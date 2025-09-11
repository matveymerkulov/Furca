import {ctx} from "./canvas.js"
import {showCollisionShapes} from "./input.js"
import {texture} from "./system.js"
import {NinePatch} from "./nine_patch.js"
import {Shape} from "./shape.js";
import {ShapeType, VectorShape} from "./vector_shape.js";

let collisionShape = new VectorShape("rgb(255, 0, 255)", 0.5)

export class Img {
    constructor(public texture: HTMLImageElement, public x = 0, public y = 0
                , public width = texture.width, public height = texture.height
                , public xMul = 0.5, public yMul = 0.5, public widthMul = 1.0, public heightMul = 1.0) {
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

    drawResized(sx: number, sy: number, swidth: number, sheight: number, shapeType: ShapeType) {
        ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, sx, sy, swidth, sheight)
    }

    drawRotated(sx: number, sy: number, swidth: number, sheight: number, shapeType: ShapeType, angle: number, flipped: boolean) {
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

