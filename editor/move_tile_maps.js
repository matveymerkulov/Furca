import MovePoint from "./move_point.js"
import {selectedObjects} from "./select_tile_maps.js"
import {canvasMouse, mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor, pivotRadius} from "./tile_map.js"
import {Layer} from "../src/layer.js"
import {distToScreen} from "../src/canvas.js"
import {dist} from "../src/functions.js"
import {Pivot} from "../src/pivot.js"

let selectedTileMaps

export default class MoveTileMaps extends MovePoint {
    conditions() {
        if(currentMode !== mode.maps) return false
        if(selectedObjects.length > 0) {
            for(const object of selectedObjects) {
                if(object instanceof Pivot) {
                    if(distToScreen(dist(object.x - mouse.x, object.y - mouse.y)) <= pivotRadius) return true
                } else if(object.collidesWithPoint(mouse.x, mouse.y)) {
                    return true
                }
            }
            return false
        }
        return objectUnderCursor !== undefined
    }

    snapToGrid(tileMap) {
        tileMap.left = Math.round(tileMap.left)
        tileMap.top = Math.round(tileMap.top)
    }

    start() {
        selectedTileMaps = []

        function addObject(object) {
            if(object instanceof Layer) {
                selectedTileMaps.push(...object.items)
            } else {
                selectedTileMaps.push(object)
            }
        }

        if(selectedObjects.length > 0) {
            for(let object of selectedObjects) {
                addObject(object)
            }
        } else {
            addObject(objectUnderCursor)
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
        for(let i = 0; i < selectedTileMaps.length; i++) {
            this.updateObject(selectedTileMaps[i], this.objectX0[i], this.objectY0[i])
            if(this instanceof Pivot) continue
            this.snapToGrid(selectedTileMaps[i])
        }
    }
}