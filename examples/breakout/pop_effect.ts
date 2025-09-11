import {Action} from "../../src/actions/action.js"
import {fx} from "./main.js"
import {Sprite} from "../../src/sprite.js";

export enum PopEffectType {
    disappear,
    appear,
}

export class PopEffect extends Action {
    width: number
    height: number
    startingTime: number

    constructor(public sprite: Sprite, public period: number, public type: PopEffectType) {
        super()
        this.width = sprite.width
        this.height = sprite.height
        this.startingTime = new Date().getTime()
    }

    draw() {
        this.sprite.draw()
    }

    update() {
        this.execute()
    }

    execute() {
        let time = (new Date().getTime() - this.startingTime) / 1000.0 / this.period
        if(time >= 1.0) {
            fx.remove(this)
            this.next()
            return
        }
        let k = this.type === PopEffectType.appear ? time : 1.0 - time
        this.sprite.setSize(this.width * k, this.height * k)
    }

    next() {
    }
}