import {apsk} from "../../system"
import {Action} from "../action"
import {rad} from "../../../../RuWebQuest 2/src/functions"
import {Sprite} from "../../sprite";

export class RotateImage extends Action {
    speed: number

    constructor(public object: Sprite, speed: number) {
        super()
        this.speed = rad(speed)
    }

    execute() {
        this.object.toSprite().turnImage(this.speed * apsk)
    }

    copy() {
        return new RotateImage(this.object.toSprite(), this.speed)
    }
}