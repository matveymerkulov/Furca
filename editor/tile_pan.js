import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"
import Drag from "../src/drag.js"
import {screenMouse} from "../src/system.js"
import {maxY0} from "./tile_set.js"
import {clamp, tiles} from "./main.js"

export let y0 = 0

export class TilePan extends Drag {
    startingY

    conditions() {
        return canvasUnderCursor === tiles
    }

    start() {
        this.startingY = screenMouse.y + y0
    }

    process() {
        y0 = this.startingY - screenMouse.y
        updateY0()
    }
}

export function updateY0() {
    y0 = clamp(y0, 0, maxY0)
}