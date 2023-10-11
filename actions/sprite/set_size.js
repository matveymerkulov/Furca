import {Action} from "../action.js"
import {apsk} from "../../system.js"

export default class SetSize extends Action {
    constructor(object, func) {
        super()
        this.object = object
        this.func = func
        this.time = 0
    }

    execute() {
        this.time += apsk
        this.object.width = this.object.height = this.func.calculate(this.time)
    }

    toJSON() {
        return `new SetSize(${this.image?.toJSON()}, ${this.centerX}, ${this.centerY}, ${this.width}, ${this.height}`
            + `, ${this.angle}, ${this.speed}, ${this.imageAngle}, ${this.active}, ${this.visible})`
    }
}