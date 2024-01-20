import {Action} from "../src/actions/action.js"
import {screenMouse} from "../src/system.js"
import {distFromScreen, setCanvas} from "../src/canvas.js"
import Drag from "../src/drag.js"
import {currentMode, currentTileMap, maps, mode as modes} from "./main.js"

export default class MovePoint extends Drag {
    constructor(canvas, direction = 1) {
        super()
        this.canvas = canvas
        this.direction = direction
    }

    start() {
        this.mouseX0 = screenMouse.x
        this.mouseY0 = screenMouse.y
        this.objectX0 = this.object.x
        this.objectY0 = this.object.y
    }

    process() {
        setCanvas(this.canvas)
        this.object.x = this.objectX0 + this.direction * distFromScreen(screenMouse.x - this.mouseX0)
        this.object.y = this.objectY0 + this.direction * distFromScreen(screenMouse.y - this.mouseY0)
    }
}