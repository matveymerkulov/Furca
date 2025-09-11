import {apsk, num} from "../../system"
import {Action} from "../action"
import {Sprite} from "../../sprite";

export class DelayedHide extends Action {
    constructor(public object: Sprite, public time: number) {
        super()
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.object.hide()
        } else {
            this.time -= apsk
        }
    }

    copy() {
        return new DelayedHide(this.object.toSprite(), num(this.time))
    }
}