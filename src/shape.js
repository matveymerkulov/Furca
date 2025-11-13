import {rad} from "./functions.js"
import {ShapeType} from "./sprite.js"

// noinspection JSSuspiciousNameCombination
export class Shape {
    constructor(color, opacity = 1.0, xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
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

        let oldStyle = graphics.fillStyle
        graphics.fillStyle = this.color
        graphics.save()
        graphics.translate(sx, sy)
        graphics.globalAlpha = this.opacity
        switch(shapeType) {
            case ShapeType.circle:
                graphics.beginPath()
                graphics.arc(halfWidth, halfHeight, halfWidth, 0, rad(360))
                graphics.fill()
                break
            case ShapeType.box:
                graphics.fillRect(0, 0, swidth, sheight)
                break
            case ShapeType.pill:
                graphics.beginPath()
                if(swidth > sheight) {
                    graphics.arc(halfHeight, halfHeight, halfHeight, rad(90), rad(270))
                    graphics.arc(swidth - halfHeight, halfHeight, halfHeight, rad(-90), rad(90))
                } else {
                    graphics.arc(halfWidth, halfWidth, halfWidth, rad(180), rad(0))
                    graphics.arc(halfWidth, sheight - halfWidth, halfWidth, rad(360), rad(180))
                }
                graphics.fill()
                break
        }
        graphics.fillStyle = oldStyle
        graphics.globalAlpha = 1.0
        graphics.restore()
    }
}

export let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)