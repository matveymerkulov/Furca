import {Sprite} from "./sprite.js"
import {apsk, num} from "./system.js"
import {Img} from "./image.js"
import {ShapeType} from "./shape_type.js"

export class AngularSprite extends Sprite {
    angle
    speed
    constructor(image, x = 0.0, y = 0.0, width = 1.0, height = 1.0
        , shapeType = ShapeType.circle, angle = 0, speed = 0, imageAngle, active = true, visible = true) {
        super(image, x, y, width, height, shapeType, imageAngle, active, visible)
        this.angle = angle
        this.speed = speed
    }

    static create(template, layer) {
        let sprite = new AngularSprite(Img.create(template.image), num(template.x), num(template.y), num(template.width)
            , num(template.height), template.shape, num(template.angle), num(template.speed), num(template.imageAngle)
            , template.visible, template.active)
        sprite.init(template, layer)
        return sprite
    }

    move() {
        this.x += Math.cos(this.angle) * this.speed * apsk
        this.y += Math.sin(this.angle) * this.speed * apsk
    }

    moveHorizontally() {
        this.x += Math.cos(this.angle) * this.speed * apsk
    }

    moveVertically() {
        this.y += Math.sin(this.angle) * this.speed * apsk
    }

    setAngleAs(sprite) {
        this.angle = sprite.angle
    }

    turn(value) {
        this.angle += value
    }
}