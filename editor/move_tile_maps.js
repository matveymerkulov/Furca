import MovePoint from "./move_point.js"
import {selectedTileMaps} from "./select_tile_maps.js"
import {canvasMouse, mouse} from "../src/system.js"
import {currentMode, mode, tileMapUnderCursor} from "./tile_map.js"

export default class MoveTileMaps extends MovePoint {
    conditions() {
        if(currentMode !== mode.maps) return false
        if(selectedTileMaps.length > 0) {
            for(const map of selectedTileMaps) {
                if(map.collidesWithPoint(mouse.x, mouse.y)) return true
            }
            return false
        }
        return tileMapUnderCursor !== undefined
    }

    snapToGrid(object) {
        object.left = Math.round(object.left)
        object.top = Math.round(object.top)
    }

    start() {
        if(selectedTileMaps.length === 0) {
            this.object = tileMapUnderCursor
            super.start()
        } else {
            this.mouseX0 = canvasMouse.x
            this.mouseY0 = canvasMouse.y
            this.objectX0 = new Array(selectedTileMaps.length)
            this.objectY0 = new Array(selectedTileMaps.length)
            for(let i = 0; i < selectedTileMaps.length; i++) {
                this.objectX0[i] = selectedTileMaps[i].x
                this.objectY0[i] = selectedTileMaps[i].y
            }
        }
    }

    process() {
        if(selectedTileMaps.length === 0) {
            super.process()
            this.snapToGrid(this.object)
        } else {
            for(let i = 0; i < selectedTileMaps.length; i++) {
                this.updateObject(selectedTileMaps[i], this.objectX0[i], this.objectY0[i])
                this.snapToGrid(selectedTileMaps[i])
            }
        }
    }
}