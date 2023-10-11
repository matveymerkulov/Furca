import {apsk} from "../system.js"
import {Action} from "./action.js"

export default class LinearChange extends Action {
    constructor(object, parameterName, speed, min, max) {
        super()
        this.object = object
        this.parameterName = parameterName
        this.speed = speed
        this.min = min
        this.max = max
    }

    execute() {
        let currentSpeed = this.speed * apsk
        let value = this.object[this.parameterName] + currentSpeed
        if(this.max !== undefined && value > this.max) {
            value = this.max
        } else if(this.min !== undefined && value < this.min) {
            value = this.min
        }
        this.object[this.parameterName] = value
    }

    static execute(object, parameterName, speed, min, max) {
        let currentSpeed = speed * apsk
        let value = object[parameterName] + currentSpeed
        if(max !== undefined && value > max) {
            value = max
        } else if(min !== undefined && value < min) {
            value = min
        }
        object[parameterName] = value
    }
}