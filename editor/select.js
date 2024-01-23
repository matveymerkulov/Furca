import Drag from "../src/drag.js"
import Box from "../src/box.js"
import {mouse, screenMouse} from "../src/system.js"
import {currentMode, currentTileMap, mode as modes} from "./main.js"

export default class Select extends Drag {
    #x
    #y
    static shape

    conditions() {
        return currentTileMap === undefined && currentMode === modes.maps
    }

    start() {
        super.start()
        this.#x = mouse.x
        this.#y = mouse.y
        Select.shape = new Box(0, 0, 0, 0)
    }

    process() {
        Select.shape.setSize(mouse.x - this.#x, mouse.y - this.#y)
        Select.shape.setCorner(this.#x, this.#y)
    }

    end() {
        Select.shape = undefined
    }
}