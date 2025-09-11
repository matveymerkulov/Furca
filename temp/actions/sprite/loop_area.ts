import {Layer} from "../../layer"
import {Action} from "../action"
import {Sprite} from "../../sprite";
import {Box} from "../../box";

export class LoopArea extends Action {
    constructor(public object: Sprite, public area: Box) {
        super()
    }

    execute() {
        if(this.object instanceof Layer) {
            this.object.items.forEach(sprite => sprite.wrap(this.area))
        } else {
            this.object.wrap(this.area)
        }
    }
}