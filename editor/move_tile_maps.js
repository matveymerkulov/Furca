import MovePoint from "./move_point.js"
import {selectedObjects} from "./select_tile_maps.js"
import {canvasMouse, mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor, pivotRadius} from "./tile_map.js"
import {Container} from "../src/container.js"
import {distToScreen} from "../src/canvas.js"
import {dist} from "../src/functions.js"
import {Pivot} from "../src/pivot.js"

let objects

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
        objects = []

        function addObject(object) {
            if(object instanceof Container) {
                objects.push(...object.children)
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
        this.objectX0 = new Array(objects.length)
        this.objectY0 = new Array(objects.length)

        for(let i = 0; i < objects.length; i++) {
            const object = objects[i]
            this.objectX0[i] = object.x
            this.objectY0[i] = object.y
        }
    }

    process() {
        for(let i = 0; i < objects.length; i++) {
            this.updateObject(objects[i], this.objectX0[i], this.objectY0[i])
            if(this instanceof Pivot) continue
            this.snapToGrid(objects[i])
        }
    }
}