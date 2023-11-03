import {Renderable} from "./renderable.js"
import {ctx, showCollisionShapes} from "./system.js"
import {ShapeType} from "./shape_type.js"

export default class Shape extends Renderable {
    constructor(color) {
        super()
        this.color = color
    }

    drawResized(sx, sy, swidth, sheight, shapeType) {
        let newWidth = swidth * this.widthMul
        let newHeight = sheight * this.heightMul
        let newX = -newWidth * this.xMul
        let newY = -newHeight * this.yMul

        let oldStyle = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.save()
        ctx.translate(sx, sy)
        switch(shapeType) {
            case ShapeType.circle:
                ctx.beginPath()
                ctx.arc(0.0, 0.0, 0.5 * swidth, 0, 2.0 * Math.PI, false)
                ctx.fill()
                break
            case ShapeType.box:
                ctx.fillRect(-0.5 * swidth, -0.5 * sheight, swidth, sheight)
                break
        }
        ctx.fillStyle = oldStyle
        ctx.restore()
    }

    drawRotated(sx, sy, swidth, sheight, shapeType, angle) {
        this.drawResized(sx, sy, swidth, sheight, shapeType)
    }}