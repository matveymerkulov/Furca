import MovePoint from "./move_point.js"
import {selectedObjects} from "./select_tile_maps.js"
import {canvasMouse, mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor, pivotRadius} from "./tile_map.js"
import {Layer} from "../src/layer.js"
import {distToScreen} from "../src/canvas.js"
import {dist} from "../../RuWebQuest 2/src/functions.js"
import {Pivot} from "../src/pivot.js"
import {TileMap} from "../src/tile_map.js";

let objects

export default class MoveTileMaps extends MovePoint {
    objectX0Array: Array<number>
    objectY0Array: Array<number>

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
        objects = []

        function addObject(object) {
            if(object instanceof Layer) {
                objects.push(...object.items)
            } else {
                objects.push(object)
            }

            if(object instanceof Pivot) {
                for(const bone of object.bones) {
                    if(bone.pivot2 !== object) continue
                    objects.push(bone.pivot1)
                }
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
        this.objectX0Array = new Array(objects.length)
        this.objectY0Array = new Array(objects.length)

        for(let i = 0; i < objects.length; i++) {
            const object = objects[i]
            this.objectX0Array[i] = object.x
            this.objectY0Array[i] = object.y
        }
    }

    process() {
        for(let i = 0; i < objects.length; i++) {
            this.updateObject(objects[i], this.objectX0Array[i], this.objectY0Array[i])
            if(this instanceof Pivot) continue
            this.snapToGrid(objects[i])
        }
    }
}