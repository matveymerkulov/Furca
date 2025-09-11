import {canvasMouse} from "../src/system.js"
import {distFromScreen} from "../src/canvas.js"
import {Drag} from "../src/drag.js"
import {Pivot} from "../src/pivot.js"
import {atan2, cos, sin} from "../../RuWebQuest 2/src/functions.js"
import {Point} from "../src/point.js";

export default class MovePoint extends Drag {
    object: Point
    mouseX0: number
    mouseY0: number
    objectX0: number
    objectY0: number

    constructor(public direction: number = 1) {
        super()
    }

    prepareObject(object: Point) {
        this.mouseX0 = canvasMouse.x
        this.mouseY0 = canvasMouse.y
        this.objectX0 = object.x
        this.objectY0 = object.y
    }

    start() {
        this.prepareObject(this.object)
    }

    updateObject(object, x0, y0) {
        object.x = x0 + this.direction * distFromScreen(canvasMouse.x - this.mouseX0)
        object.y = y0 + this.direction * distFromScreen(canvasMouse.y - this.mouseY0)
        if(object instanceof Pivot) {
            for(const bone of object.bones) {
                if(bone.pivot1 === object) {
                    const object2 = bone.pivot2
                    const length = bone.length
                    const angle = atan2(object.y - object2.y, object.x - object2.x)
                    object.x = object2.x + cos(angle) * length
                    object.y = object2.y + sin(angle) * length
                    return
                }
            }
        }
    }

    process() {
        this.updateObject(this.object, this.objectX0, this.objectY0)
    }
}