import {apsk, num} from "../../system.js"
import {Action} from "../action.js"

export default class DelayedRemove extends Action {
    constructor(sprite, layer, time) {
        super()
        this.sprite = sprite
        this.layer = layer
        this.time = time
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.layer.remove(this.sprite)
        } else {
            this.time -= apsk
        }
    }

    copy(from) {
        return new DelayedRemove(this.sprite.toSprite(), this.layer, num(this.time))
    }
}