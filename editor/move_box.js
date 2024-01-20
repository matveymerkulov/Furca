import {Action} from "../src/actions/action.js"
import {screenMouse} from "../src/system.js"
import {distFromScreen, setCanvas} from "../src/canvas.js"
import Drag from "../src/drag.js"
import {currentMode, currentTileMap, maps, mode as modes} from "./main.js"

export default class MoveBox extends Drag {
    conditions() {
        return currentTileMap !== undefined && currentMode === modes.maps
    }

    start() {
        this.object = currentTileMap
        this.mouseX0 = screenMouse.x
        this.mouseY0 = screenMouse.y
        this.objectX0 = this.object.x
        this.objectY0 = this.object.y
    }

    process() {
        setCanvas(maps)
        this.object.x = this.objectX0 + distFromScreen(screenMouse.x - this.mouseX0)
        this.object.y = this.objectY0 + distFromScreen(screenMouse.y - this.mouseY0)
    }
}