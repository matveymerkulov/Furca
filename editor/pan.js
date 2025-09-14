import MovePoint from "./move_point.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"

export class Pan extends MovePoint {
    constructor() {
        super(-1)
    }

    conditions() {
        return canvasUnderCursor === currentCanvas
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