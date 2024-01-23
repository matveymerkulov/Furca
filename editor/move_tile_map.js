import MovePoint from "./move_point.js"
import {currentMode, currentTileMap, mode as modes} from "./main.js"

export default class MoveTileMap extends MovePoint {
    conditions() {
        return currentTileMap !== undefined && currentMode === modes.maps
    }

    start() {
        this.object = currentTileMap
        super.start()
    }
}