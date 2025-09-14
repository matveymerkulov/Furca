import {Action} from "../action.js"
import {apsk} from "../../system.js"

export class AnimateAngle extends Action {
    constructor(object, func) {
        super()
        this.object = object
        this.func = func
        this.time = 0
    }

    execute() {
        this.time += apsk
        this.object.angle = this.func.calculate(this.time)
    }
}