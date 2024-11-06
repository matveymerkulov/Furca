import {Point} from "./point.js"
import {ctx, xToScreen, yToScreen} from "./canvas.js"
import {atan2, cos, dist, rad, sin} from "./functions.js"
import {drawArrow} from "../editor/draw.js"
import {drawPivotArrow} from "../editor/tile_map.js"

export class Pivot extends Point {
    bones = []

    addBone(pivot2) {
        for(const bone of this.bones) {
            if(bone.pivot === this) return
        }
        this.bones.push(new Bone(this, pivot2))
    }
}

export class Bone {
    pivot1
    pivot2
    length

    constructor(pivot1, pivot2) {
        this.pivot1 = pivot1
        this.pivot2 = pivot2
        this.length = dist(pivot2.x - pivot1.x, pivot2.y - pivot1.y)
    }
}