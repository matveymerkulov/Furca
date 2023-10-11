import {Action} from "../action.js"

export default class SetBounds extends Action {
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
            if (sprite.rightX < bounds.leftX || sprite.leftX > bounds.rightX
                || sprite.bottomY < bounds.topY || sprite.topY > bounds.bottomY) {
                items.splice(i, 1)
            } else {
                i++
            }
        }
    }
}