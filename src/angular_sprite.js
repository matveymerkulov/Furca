import {ShapeType, Sprite} from "./sprite.js"
import {apsk, num} from "./system.js"


export class AngularSprite extends Sprite {
    angle
    speed
    constructor(texture, x = 0.0, y = 0.0, width = 1.0, height = 1.0,
                shapeType = ShapeType.circle, angle, ang = 0, speed = 0,
                active = true, visible = true) {
        super(texture, x, y, width, height, shapeType, angle, active, visible)
        this.angle = angle
        this.speed = speed
    }

    static create(template, layer) {
        let sprite = new AngularSprite(template.texture, num(template.x), num(template.y),
            num(template.shapeWidth), num(template.shapeHeight), template.shape, num(template.angle),
            num(template.speed), template.visible, template.active)
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