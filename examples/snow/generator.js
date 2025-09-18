import {Action} from "../../src/actions/action.js"
import {rnd} from "../../src/functions.js"
import {VectorSprite} from "../../src/vector_sprite.js"


import {ShapeType} from "../../src/sprite.js"

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
                return new VectorSprite(this.image, rnd(shape.left, shape.right), rnd(shape.top, shape.bottom))
        }
    }
}