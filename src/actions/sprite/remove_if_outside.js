import {Action} from "../action.js"

export class RemoveIfOutside extends Action {
    constructor(layer, bounds) {
        super()
        this.layer = layer
        this.bounds = bounds
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