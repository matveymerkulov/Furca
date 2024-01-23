import MovePoint from "./move_point.js"
import {mouseCanvas} from "./main.js"
import {currentCanvas} from "../src/canvas.js"

export class Pan extends MovePoint {
    constructor() {
        super(-1)
    }

    conditions() {
        return mouseCanvas === currentCanvas
    }

    start() {
        this.object = currentCanvas
        super.start()
    }

    process() {
        super.process()
        currentCanvas.updateParameters()
    }
}