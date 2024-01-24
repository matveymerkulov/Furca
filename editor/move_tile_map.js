import MovePoint from "./move_point.js"
import {currentMode, mode as modes, tileMapUnderCursor} from "./main.js"

export default class MoveTileMap extends MovePoint {
    conditions() {
        return tileMapUnderCursor !== undefined && currentMode === modes.maps
    }

    start() {
        this.object = tileMapUnderCursor
        super.start()
    }

    process() {
        super.process()
        this.object.leftX = Math.round(this.object.leftX)
        this.object.topY = Math.round(this.object.topY)
    }
}