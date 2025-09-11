import {Sprite} from "./sprite.js"
import {apsk, num} from "./system.js"
import {ShapeType} from "./vector_shape.js"
import {Img} from "./image.js"
import {Layer} from "./layer.js";

export class VectorSprite extends Sprite {
    constructor(image: Img, x = 0.0, y = 0.0, width = 1.0, height = 1.0
        , shapeType = ShapeType.circle, public dx = 0, public dy = 0, imageAngle = 0
                , active = true, visible = true) {
        super(image, x, y, width, height, shapeType, imageAngle, active, visible)
    }

    setMovingVector(dx: number, dy: number) {
        this.dx = dx
        this.dy = dy
    }

    move() {
        this.x += this.dx * apsk
        this.y += this.dy * apsk
    }

    moveHorizontally() {
        this.x += this.dx * apsk
    }

    moveVertically() {
        this.y += this.dy * apsk
    }
}