import {apsk} from "../system"
import {Action} from "./action"
import {Sprite} from "../sprite";

export class LinearChange extends Action {
    constructor(public object: Sprite, public parameterName: string
                , public speed: number, public min: number, public max: number) {
        super()
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

    static execute(object: Sprite, parameterName: string, speed: number, min: number, max: number) {
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