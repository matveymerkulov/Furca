import {Renderable} from "./renderable.js"
import {ctx} from "./canvas.js"

export class NinePatch extends Renderable {
    #texture
    #x
    #y
    #width
    #height

    constructor(image, horizontal1, horizontal2, vertical1, vertical2) {
        super()
        this.#texture = image.texture
        this.#x = [0, horizontal1, horizontal2]
        this.#y = [0, vertical1, vertical2]
        this.#width = [horizontal1, horizontal2 - horizontal1, image.width - horizontal2]
        this.#height = [vertical1, vertical2 - vertical1, image.height - vertical2]
    }

    drawResized(sx, sy, swidth, sheight, shapeType) {
        let x = sx - 0.5 * swidth
        let y = sy - 0.5 * sheight
        let x0 = [x, x + this.#width[0], x + swidth - this.#width[2]]
        let y0 = [y, y + this.#height[0], y + sheight - this.#height[2]]
        let width0 = [this.#width[0], swidth - this.#width[0] - this.#width[2], this.#width[2]]
        let height0 = [this.#height[0], sheight - this.#height[0] - this.#height[2], this.#height[2]]
        for(let j = 0; j <= 2; j++) {
            if(this.#height[j] <= 0 || height0[j] <= 0) continue
            for(let i = 0; i <= 2; i++) {
                if(this.#width[i] <= 0 || width0[i] <= 0) continue
                ctx.drawImage(this.#texture, this.#x[i], this.#y[j], this.#width[i], this.#height[j]
                    , x0[i], y0[j], width0[i], height0[j])
            }
        }
    }

    drawRotated(sx, sy, swidth, sheight, shapeType, angle, flipped) {
        this.drawResized(sx, sy, swidth, sheight, shapeType)
    }
}