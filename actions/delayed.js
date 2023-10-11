import {apsk} from "../system.js"
import {Action} from "./action.js"

export default class Delayed extends Action {
    constructor(key, cooldown) {
        super()
        this.key = key
        this.cooldown = cooldown
        this.time = 0
    }

    active() {
        if(this.time > 0) {
            this.time -= apsk
            return false
        } else {
            if(!this.key.isDown) return false
            this.time = this.cooldown
            return true
        }
    }
}