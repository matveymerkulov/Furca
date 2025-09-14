import {Action} from "../action.js"
import {apsk} from "../../system.js"

export class AnimateOpacity extends Action {
    constructor(object, func) {
        super()
        this.object = object
        this.func = func
        this.time = 0
    }

    execute() {
        this.time += apsk
        this.object.opacity = this.func.calculate(this.time)
    }
}