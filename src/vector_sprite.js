// noinspection JSUnusedGlobalSymbols

import {ShapeType, Sprite} from "./sprite.js"
import {apsk, num} from "./system.js"

export class VectorSprite extends Sprite {
    dx
    dy
    constructor(textureArray, x = 0.0, y = 0.0, width = 1.0, height = 1.0
        , shapeType = ShapeType.circle, dx = 0, dy = 0, angle
                , active = true, visible = true) {
        super(textureArray, x, y, width, height, shapeType, angle, active, visible)
        this.dx = dx
        this.dy = dy
    }

    static create(template, layer) {
        let sprite = new VectorSprite(Img.create(template.texture), num(template.x), num(template.y), num(template.shapeWidth)
            , num(template.shapeHeight), template.shape, num(template.dx), num(template.dy), num(template.imageAngle)
            , template.visible, template.active)
        sprite.init(template, layer)
        return sprite
    }

    setMovingVector(dx, dy) {
        this.dx = dx
        this.dy = dy
    }

    move() {
        this.shiftShape(this.dx * apsk, this.dy * apsk)
    }

    moveHorizontally() {
        this.x += this.dx * apsk
    }

    moveVertically() {
        this.y += this.dy * apsk
    }
}