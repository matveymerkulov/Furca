import {Action} from "../action.js"

export class RemoveIfOutside extends Action {
    constructor(bounds) {
        super()
        this.bounds = bounds
    }

    execute(container) {
        let items = container.children
        let bounds = this.bounds
        let i = 0
        while(i < items.length) {
            let sprite = items[i]
            if (sprite.right < bounds.left || sprite.left > bounds.right
                    || sprite.bottom < bounds.top || sprite.top > bounds.bottom) {
                sprite.destroy()
                items.splice(i, 1)
            } else {
                i++
            }
        }
    }
}