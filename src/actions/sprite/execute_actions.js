import {Container} from "../../container.js"
import {current} from "../../variable/sprite.js"
import {Action} from "../action.js"

export class ExecuteActions extends Action {
    constructor(object) {
        super()
        this.object = object
    }

    executeActions(sprite) {
        current.sprite = sprite
        sprite.actions.forEach(command => command.execute())
    }

    execute() {
        if(this.object instanceof Container) {
            this.object.children.forEach(item => this.executeActions(item))
        } else {
            this.executeActions(this.object.toSprite())
        }
    }
}