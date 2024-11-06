import {Point} from "./point.js"
import {ctx, xToScreen, yToScreen} from "./canvas.js"
import {atan2, cos, rad, sin} from "./functions.js"
import {drawArrow} from "../editor/draw.js"

export class Pivot extends Point {
    link

    constructor(x, y) {
        super(x, y)
    }
}