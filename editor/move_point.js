import {canvasMouse, screenMouse} from "../src/system.js"
import {distFromScreen} from "../src/canvas.js"
import {Drag} from "../src/drag.js"

export default class MovePoint extends Drag {
    constructor(direction = 1) {
        super()
        this.direction = direction
    }

    prepareObject(object) {
        this.mouseX0 = canvasMouse.x
        this.mouseY0 = canvasMouse.y
        this.objectX0 = object.x
        this.objectY0 = object.y
    }

    start() {
        this.prepareObject(this.object)
    }

    updateObject(object, x0, y0) {
        object.x = x0 + this.direction * distFromScreen(canvasMouse.x - this.mouseX0)
        object.y = y0 + this.direction * distFromScreen(canvasMouse.y - this.mouseY0)
    }

    process() {
        this.updateObject(this.object, this.objectX0, this.objectY0)
    }
}