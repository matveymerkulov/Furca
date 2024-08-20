import {apsk, num} from "../../system.js"
import {Action} from "../action.js"

export class DelayedHide extends Action {
    constructor(object, time) {
        super()
        this.object = object
        this.time = time
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.object.hide()
        } else {
            this.time -= apsk
        }
    }

    copy(from) {
        return new DelayedHide(this.object.toSprite(), num(this.time))
    }
}