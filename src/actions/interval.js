import {apsk} from "../system.js"
import {Action} from "./action.js"

export class Interval extends Action {
    constructor(interval) {
        super()
        this.interval = interval
        this.time = 0
    }

    active() {
        if(this.time > 0) {
            this.time -= apsk
            return false
        } else {
            this.time = this.interval
            return true
        }
    }
}