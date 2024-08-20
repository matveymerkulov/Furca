import {Action} from "../../src/actions/action.js"
import {Sprite} from "../../src/sprite.js"
import {ShapeType} from "../../src/shape.js"
import {rnd} from "../../src/functions.js"

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