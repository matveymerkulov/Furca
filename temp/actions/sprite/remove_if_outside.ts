import {Action} from "../action"
import {Layer} from "../../layer";
import {Box} from "../../box";
import {Shape} from "../../shape";

export class RemoveIfOutside<Obj extends Box> extends Action {
    constructor(public layer: Layer<Obj>, public bounds: Box) {
        super()
    }

    execute() {
        let items = this.layer.items
        let bounds = this.bounds
        let i = 0
        while(i < items.length) {
            let sprite = items[i]
            if (sprite.right < bounds.left || sprite.left > bounds.right
                    || sprite.bottom < bounds.top || sprite.top > bounds.bottom) {
                items.splice(i, 1)
            } else {
                i++
            }
        }
    }
}