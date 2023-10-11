import Layer from "../../layer.js"
import {Action} from "../action.js"

export default class LoopArea extends Action {
    constructor(object, area) {
        super()
        this.object = object
        this.area = area
    }

    execute() {
        if(this.object instanceof Layer) {
            this.object.items.forEach(sprite => sprite.loop(this.area))
        } else {
            this.object.loop(this.area)
        }
    }
}