import {Action} from "../../src/actions/action.js"
import {rnd} from "../../../RuWebQuest 2/src/functions.js"
import {VectorSprite} from "../../src/vector_sprite.js"
import {Img} from "../../src/image.js";
import {Sprite} from "../../src/sprite.js";
import {Box} from "../../src/box.js";
import {ShapeType} from "../../src/shape_type"

export default class Generator extends Action {
    constructor(private readonly image: Img, private shape: Box, private type: ShapeType) {
        super()
    }

    execute() {
        let shape = this.shape
        switch(this.type) {
            case ShapeType.box:
                return new VectorSprite(this.image, rnd(shape.left, shape.right), rnd(shape.top, shape.bottom))
        }
    }
}