import MovePoint from "./move_point.js"
import {currentMode, mode as modes, tileMapUnderCursor} from "./main.js"
import {selected} from "./select.js"
import {mouse, screenMouse} from "../src/system.js"

export default class MoveTileMap extends MovePoint {
    conditions() {
        if(currentMode !== modes.maps) return false
        if(selected.length > 0) {
            for(const map of selected) {
                if(map.collidesWithPoint(mouse.x, mouse.y)) return true
            }
            return false
        }
        return tileMapUnderCursor !== undefined
    }

    snapToGrid(object) {
        object.leftX = Math.round(object.leftX)
        object.topY = Math.round(object.topY)
    }

    start() {
        if(selected.length === 0) {
            this.object = tileMapUnderCursor
            super.start()
        } else {
            this.mouseX0 = screenMouse.x
            this.mouseY0 = screenMouse.y
            this.objectX0 = new Array(selected.length)
            this.objectY0 = new Array(selected.length)
            for(const i in selected) {
                this.objectX0[i] = selected[i].x
                this.objectY0[i] = selected[i].y
            }
        }
    }

    process() {
        if(selected.length === 0) {
            super.process()
            this.snapToGrid(this.object)
        } else {
            for(const i in selected) {
                this.updateObject(selected[i], this.objectX0[i], this.objectY0[i])
                this.snapToGrid(selected[i])
            }
        }
    }
}