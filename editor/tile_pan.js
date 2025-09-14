import {Drag} from "../src/drag.js"
import {canvasMouse} from "../src/system.js"
import {maxY0} from "./tile_set.js"
import {clamp} from "../src/functions.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"


export let y0 = 0

export class TilePan extends Drag {
    startingY

    conditions() {
        return canvasUnderCursor === currentCanvas
    }

    start() {
        this.startingY = canvasMouse.y + y0
    }

    process() {
        y0 = this.startingY - canvasMouse.y
        updateY0()
    }
}

export function updateY0() {
    y0 = clamp(y0, 0, maxY0)
}