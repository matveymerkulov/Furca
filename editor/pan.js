import MovePoint from "./move_point.js"
import {mouseCanvas} from "./main.js"
import {distFromScreen, setCanvas} from "../src/canvas.js"
import {screenMouse} from "../src/system.js"

export class Pan extends MovePoint {
    constructor(canvas) {
        super(canvas, -1)
    }

    conditions() {
        return mouseCanvas === this.canvas
    }

    start() {
        this.object = this.canvas
        super.start()
    }

    process() {
        super.process()
        this.canvas.update()
    }
}