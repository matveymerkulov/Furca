import {Sprite} from "./sprite.js"
import {apsk} from "./system.js"
import {Img} from "./image.js"
import {cos, sin} from "./functions.js"
import {ShapeType} from "./shape_type"

export class AngularSprite extends Sprite {
    constructor(image: Img, x = 0.0, y = 0.0, width = 1.0, height = 1.0, shapeType = ShapeType.circle
                , public angle = 0, public speed = 0, imageAngle: number = 0, active = true, visible = true) {
        super(image, x, y, width, height, shapeType, imageAngle, active, visible)
        this.angle = angle
        this.speed = speed
    }

    move() {
        this.x += cos(this.angle) * this.speed * apsk
        this.y += sin(this.angle) * this.speed * apsk
    }

    moveHorizontally() {
        this.x += cos(this.angle) * this.speed * apsk
    }

    moveVertically() {
        this.y += sin(this.angle) * this.speed * apsk
    }

    setAngleAs(sprite: Sprite) {
        this.angle = sprite.angle
    }

    turn(value: number) {
        this.angle += value
    }
}