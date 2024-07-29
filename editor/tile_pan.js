import Drag from "../src/drag.js"
import {clamp, screenMouse} from "../src/system.js"
import {maxY0} from "./tile_set.js"


export let y0 = 0

export class TilePan extends Drag {
    startingY

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