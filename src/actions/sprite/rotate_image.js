import {apsk} from "../../system.js"
import {Action} from "../action.js"

export class RotateImage extends Action {
    constructor(object, speed) {
        super()
        this.object = object
        this.speed = rad(speed)
    }

    execute() {
        this.object.toSprite().turnImage(this.speed * apsk)
    }

    copy() {
        return new RotateImage(this.object.toSprite(), this.speed)
    }
}