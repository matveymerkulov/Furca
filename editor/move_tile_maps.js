import MovePoint from "./move_point.js"
import {selectedTileMaps} from "./select_tile_maps.js"
import {canvasMouse, mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor} from "./tile_map.js"
import {Layer} from "../src/layer.js"

export default class MoveTileMaps extends MovePoint {
    conditions() {
        if(currentMode !== mode.maps) return false
        if(selectedTileMaps.length > 0) {
            for(const map of selectedTileMaps) {
                if(map.collidesWithPoint(mouse.x, mouse.y)) return true
            }
            return false
        }
        return objectUnderCursor !== undefined
    }

    snapToGrid(object) {
        object.left = Math.round(object.left)
        object.top = Math.round(object.top)
    }

    start() {
        if(selectedTileMaps.length === 0) {
            this.object = objectUnderCursor
            if(this.object instanceof Layer) {
                selectedTileMaps.push(...this.object.items)
            } else {
                super.start()
                return
            }
        }
        this.mouseX0 = canvasMouse.x
        this.mouseY0 = canvasMouse.y
        this.objectX0 = new Array(selectedTileMaps.length)
        this.objectY0 = new Array(selectedTileMaps.length)
        for(let i = 0; i < selectedTileMaps.length; i++) {
            this.objectX0[i] = selectedTileMaps[i].x
            this.objectY0[i] = selectedTileMaps[i].y
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

    end() {
        if(objectUnderCursor instanceof Layer && selectedTileMaps.length <= objectUnderCursor.items.length) {
            selectedTileMaps.length = 0
        }
    }
}