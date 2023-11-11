import {Action} from "./action.js"
import Sprite from "../sprite.js"
import {rnd} from "../system.js"
import {ShapeType} from "../shape_type.js"

export default class Generator extends Action {
    constructor(image, shape, type) {
        super()
        this.image = image
        this.shape = shape
        this.type = type
    }

    execute() {
        let shape = this.shape
        switch(this.type) {
            case ShapeType.box:
                return new Sprite(this.image, rnd(shape.leftX, shape.rightX), rnd(shape.topY, shape.bottomY))
        }
    }
}