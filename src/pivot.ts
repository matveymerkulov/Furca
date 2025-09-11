import {Point} from "./point.js"
import {dist} from "./functions.js"

export class Pivot extends Point {
    bones: Bone[] = []

    addBone(pivot2: Pivot) {
        for(const bone of this.bones) {
            if(bone.pivot1 === this) return
        }
        const bone = new Bone(this, pivot2)
        this.bones.push(bone)
        pivot2.bones.push(bone)
    }
}

export class Bone {
    length: number

    constructor(public pivot1: Pivot, public pivot2: Pivot) {
        this.pivot1 = pivot1
        this.pivot2 = pivot2
        this.length = dist(pivot2.x - pivot1.x, pivot2.y - pivot1.y)
    }
}