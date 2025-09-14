import {Box} from "../box.js"
import {Align, defaultFontSize, setFontSize} from "../system.js"
import {ctx, xToScreen, yToScreen} from "../canvas.js"

export class Label extends Box {
    constructor(sprite, items, fontSize, horizontalAlign, verticalAlign, format = undefined
                , image = undefined, sizeMul = 1) {
        super(sprite.x, sprite.y, sprite.width, sprite.height)
        this.items = items
        this.fontSize = fontSize
        this.horizontalAlign = horizontalAlign
        this.verticalAlign = verticalAlign
        this.format = format
        this.image = image
        this.sizeMul = sizeMul
        this.visible = true
    }

    draw() {
        if(!this.visible) return

        setFontSize(this.fontSize)

        let text = ""
        this.items.forEach(item => text += (typeof item === "string" ? item : item.toString()))

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
            width *= this.sizeMul
            height *= this.sizeMul
        }

        switch(this.horizontalAlign) {
            case Align.left:
                x = xToScreen(this.left)
                break
            case Align.center:
                x = xToScreen(this.x) - 0.5 * width
                break
            case Align.right:
                x = xToScreen(this.right) - width
                break
        }

        switch(this.verticalAlign) {
            case Align.top:
                y = yToScreen(this.top)
                break
            case Align.center:
                y = yToScreen(this.y) - 0.5 * height
                break
            case Align.bottom:
                y = yToScreen(this.bottom) - height
                break
        }

        if (this.format?.startsWith("I")) {
            let value = Math.round(parseInt(text) / parseInt(formatString))
            width /= value
            let image = this.image
            for(let i = 0; i < value ; i++) {
                ctx.drawImage(image.texture, image.x + 1, image.y + 1, image.width, image.height, x + i * width, y
                    , width - 1, height - 1)
            }
        } else {
            ctx.fillStyle = "black"
            for(let dy = -2; dy <= 2; dy += 2) {
                for(let dx = -2; dx <= 2; dx += 2) {
                    ctx.fillText(text, x + dx, y + dy)
                }
            }
            ctx.fillStyle = "white"
            ctx.fillText(text, x, y)
            setFontSize(defaultFontSize)
        }
    }

    show(...objects) {
        this.items = objects
    }
}