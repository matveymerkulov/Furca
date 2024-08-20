import {Action} from "../action.js"

export class AddAction extends Action {
    constructor(sprite, action) {
        super()
        this.sprite = sprite
        this.action = action
    }

    execute() {
        let sprite = this.sprite.toSprite()
        sprite.actions.push(this.action.copy())
    }
}