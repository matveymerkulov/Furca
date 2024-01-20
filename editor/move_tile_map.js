import MovePoint from "./move_point.js"
import {currentMode, currentTileMap, maps, mode as modes} from "./main.js"
import {setCanvas} from "../src/canvas.js"

export default class MoveTileMap extends MovePoint {
    constructor(canvas) {
        super(canvas)
    }

    conditions() {
        return currentTileMap !== undefined && currentMode === modes.maps
    }

    start() {
        this.object = currentTileMap
        super.start()
    }
}