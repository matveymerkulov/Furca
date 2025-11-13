import {Action} from "../../src/actions/action.js"
import {fx} from "./main.js"

export const PopEffectType = {
    disappear: Symbol("disappear"),
    appear: Symbol("appear"),
}

export class PopEffect extends Action {
    #sprite
    #width
    #height
    #period
    #startingTime
    #type

    constructor(sprite, period, type) {
        super()
        this.#sprite = sprite
        this.#width = sprite.shapeWidth
        this.#height = sprite.shapeHeight
        this.#period = period
        this.#type = type
        this.#startingTime = new Date().getTime()
    }

    draw() {
        this.#sprite.draw()
    }

    update() {
        this.execute()
    }

    execute() {
        let time = (new Date().getTime() - this.#startingTime) / 1000.0 / this.#period
        if(time >= 1.0) {
            fx.remove(this)
            this.next()
            return
        }
        let k = this.#type === PopEffectType.appear ? time : 1.0 - time
        this.#sprite.setSize(this.#width * k, this.#height * k)
    }

    next() {
    }
}