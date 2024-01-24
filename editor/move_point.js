import {screenMouse} from "../src/system.js"
import {distFromScreen} from "../src/canvas.js"
import Drag from "../src/drag.js"

export default class MovePoint extends Drag {
    constructor(direction = 1) {
        super()
        this.direction = direction
    }

    prepareObject(object) {
        this.mouseX0 = screenMouse.x
        this.mouseY0 = screenMouse.y
        this.objectX0 = object.x
        this.objectY0 = object.y
    }

    start() {
        this.prepareObject(this.object)
    }

    updateObject(object, x0, y0) {
        object.x = x0 + this.direction * distFromScreen(screenMouse.x - this.mouseX0)
        object.y = y0 + this.direction * distFromScreen(screenMouse.y - this.mouseY0)
    }

    process() {
        this.updateObject(this.object, this.objectX0, this.objectY0)
    }
}