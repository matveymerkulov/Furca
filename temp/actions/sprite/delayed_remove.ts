import {apsk, num} from "../../system"
import {Action} from "../action"
import {Sprite} from "../../sprite";
import {Layer} from "../../layer";

export class DelayedRemove extends Action {
    constructor(public sprite: Sprite, public layer: Layer, public time: number) {
        super()
    }

    execute() {
        super.execute()
        if(this.time <= 0.0) {
            this.layer.remove(this.sprite)
        } else {
            this.time -= apsk
        }
    }

    copy() {
        return new DelayedRemove(this.sprite.toSprite(), this.layer, num(this.time))
    }
}