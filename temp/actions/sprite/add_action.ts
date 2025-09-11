import {Action} from "../action"
import {Sprite} from "../../sprite";

export class AddAction extends Action {
    constructor(public sprite: Sprite, public action: Action) {
        super()
    }

    execute() {
        let sprite = this.sprite.toSprite()
        sprite.actions.push(this.action.copy())
    }
}