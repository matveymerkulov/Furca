import {Sprite} from "./sprite.js"
import {apsk, num} from "./system.js"
import {ShapeType} from "./shape.js"
import {Img} from "./image.js"

export class VectorSprite extends Sprite {
    dx
    dy
    constructor(image, x = 0.0, y = 0.0, width = 1.0, height = 1.0
        , shapeType = ShapeType.circle, dx = 0, dy = 0, imageAngle
                , active = true, visible = true) {
        super(image, x, y, width, height, shapeType, imageAngle, active, visible)
        this.dx = dx
        this.dy = dy
    }

    static create(template, layer) {
        let sprite = new VectorSprite(Img.create(template.image), num(template.x), num(template.y), num(template.width)
            , num(template.height), template.shape, num(template.dx), num(template.dy), num(template.imageAngle)
            , template.visible, template.active)
        sprite.init(template, layer)
        return sprite
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