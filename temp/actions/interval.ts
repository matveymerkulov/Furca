import {apsk} from "../system"
import {Action} from "./action"

export class Interval extends Action {
    time = 0

    constructor(public interval: number) {
        super()
    }

    active() {
        if(this.time > 0) {
            this.time -= apsk
            return false
        }

        this.time = this.interval
        return true
    }
}