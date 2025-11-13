import {Container} from "../../container.js"
import {Action} from "../action.js"

export class LoopArea extends Action {
    constructor(object, area) {
        super()
        this.object = object
        this.area = area
    }

    execute() {
        if(this.object instanceof Container) {
            this.object.children.forEach(sprite => sprite.wrap(this.area))
        } else {
            this.object.wrap(this.area)
        }
    }
}