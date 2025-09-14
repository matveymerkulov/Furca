import {Renderable} from "./renderable.js"
import {ctx} from "./canvas.js"
import {rad} from "./functions.js"

export let ShapeType = {
    circle: Symbol("circle"),
    box: Symbol("box"),
    pill: Symbol("pill"),
}

// noinspection JSSuspiciousNameCombination
export class Shape extends Renderable {
    constructor(color, opacity = 1.0, xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
        super()
        this.color = color
        this.opacity = opacity
        this.xMul = xMul
        this.yMul = yMul
        this.widthMul = widthMul
        this.heightMul = heightMul
    }

    drawResized(sx, sy, swidth, sheight, shapeType) {
        let newWidth = swidth * this.widthMul
        let newHeight = sheight * this.heightMul
        let newX = -newWidth * this.xMul
        let newY = -newHeight * this.yMul

        let halfWidth = 0.5 * swidth
        let halfHeight = 0.5 * sheight

        let oldStyle = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.save()
        ctx.translate(sx, sy)
        ctx.globalAlpha = this.opacity
        switch(shapeType) {
            case ShapeType.circle:
                ctx.beginPath()
                ctx.arc(halfWidth, halfHeight, halfWidth, 0, rad(360))
                ctx.fill()
                break
            case ShapeType.box:
                ctx.fillRect(0, 0, swidth, sheight)
                break
            case ShapeType.pill:
                ctx.beginPath()
                if(swidth > sheight) {
                    ctx.arc(halfHeight, halfHeight, halfHeight, rad(90), rad(270))
                    ctx.arc(swidth - halfHeight, halfHeight, halfHeight, rad(-90), rad(90))
                } else {
                    ctx.arc(halfWidth, halfWidth, halfWidth, rad(180), rad(0))
                    ctx.arc(halfWidth, sheight - halfWidth, halfWidth, rad(360), rad(180))
                }
                ctx.fill()
                break
        }
        ctx.fillStyle = oldStyle
        ctx.globalAlpha = 1.0
        ctx.restore()
    }

    drawRotated(sx, sy, swidth, sheight, shapeType, angle) {
        this.drawResized(sx - 0.5 * swidth, sy - 0.5 * sheight, swidth, sheight, shapeType)
    }
}