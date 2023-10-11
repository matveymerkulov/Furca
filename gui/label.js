import Shape from "../shape.js"
import {align, ctx} from "../system.js"
import {xToScreen, yToScreen} from "../canvas.js"

export default class Label extends Shape {
    constructor(sprite, items, horizontalAlign, verticalAlign, format, image) {
        super(sprite.centerX, sprite.centerY, sprite.width, sprite.height)
        this.items = items
        this.horizontalAlign = horizontalAlign
        this.verticalAlign = verticalAlign
        this.format = format
        this.image = image
    }

    draw() {
        let text = ""
        this.items.forEach(item => text += typeof item === "string" ? item : item.toString())

        let formatString = this.format?.substring(1)
        if (this.format === undefined) {
        } else if (this.format.startsWith("Z")) {
            text = "0".repeat(parseInt(formatString) - text.length) + text
        } else if (this.format.startsWith("R")) {
            let value = parseInt(text)
            if(value > 5) {
                text = formatString + " x " + value
            } else {
                text = formatString.repeat(value)
            }
        }

        let x, y
        const metrics = ctx.measureText(text)
        let width = metrics.width
        let height = metrics.actualBoundingBoxDescent
        if (this.format?.startsWith("I")) {
            height *= 2
            let k = height / this.image.height
            width = this.image.width * k * Math.round(parseInt(text) / parseInt(formatString))
        }

        switch(this.horizontalAlign) {
            case align.left:
                x = xToScreen(this.leftX)
                break
            case align.center:
                x = xToScreen(this.centerX) - 0.5 * width
                break
            case align.right:
                x = xToScreen(this.rightX) - width
                break
        }

        switch(this.verticalAlign) {
            case align.top:
                y = yToScreen(this.topY)
                break
            case align.center:
                y = yToScreen(this.centerY) - 0.5 * height
                break
            case align.bottom:
                y = yToScreen(this.bottomY) - height
                break
        }

        if (this.format?.startsWith("I")) {
            let value = Math.round(parseInt(text) / parseInt(formatString))
            width /= value
            for(let i = 0; i < value ; i++) {
                ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, x + i * width, y, width, height)
            }
        } else {
            ctx.fillStyle = "white"
            ctx.fillText(text, x, y)
        }
    }

    show(...objects) {
        this.items = objects
    }
}