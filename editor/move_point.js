import {screenMouse} from "../src/system.js"
import {distFromScreen} from "../src/canvas.js"
import Drag from "../src/drag.js"

export default class MovePoint extends Drag {
    constructor(direction = 1) {
        super()
        this.direction = direction
    }

    start() {
        this.mouseX0 = screenMouse.x
        this.mouseY0 = screenMouse.y
        this.objectX0 = this.object.x
        this.objectY0 = this.object.y
    }

    process() {
        this.object.x = this.objectX0 + this.direction * distFromScreen(screenMouse.x - this.mouseX0)
        this.object.y = this.objectY0 + this.direction * distFromScreen(screenMouse.y - this.mouseY0)
    }
}