import Shape from "./shape.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {apsk, num, rad} from "./system.js"
import Animate from "./actions/sprite/animate.js"

export default class Sprite extends Shape {
    constructor(image, centerX = 0.0, centerY = 0.0, width = 1.0, height = 1.0
                , angle = 0.0, speed = 0.0, imageAngle
                , active = true, visible = true) {
        super(centerX, centerY, width, height)
        this.image = image
        this.imageAngle = imageAngle
        this.angle = angle
        this.speed = speed
        this.visible = visible
        this.active = active
        this.actions = []
    }

    static create(layer, image, centerX, centerY, width, height, angle, speed, animationSpeed, imageAngle, active, visible) {
        if(typeof centerX === "object") {
            let pos = centerX
            centerX = pos.centerX
            centerY = pos.centerY
        }
        let sprite = new Sprite(image, centerX, centerY, width, height, angle, speed, imageAngle, active, visible)
        if(layer) layer.add(sprite)
        if(animationSpeed !== undefined) {
            sprite.actions = [new Animate(sprite, image, animationSpeed)]
            sprite.image = image._images[0]
        }
        return sprite
    }

    static createFromTemplate(template) {
        let sprite = new Sprite()
        sprite.setFromTemplate(template)
        if(template.layer !== undefined) template.layer.add(sprite)
        if(template.animationSpeed !== undefined) {
            sprite.actions = [new Animate(sprite, template.images, num(template.animationSpeed))]
            sprite.image = template.images._images[0]
        }
        if(template.parameters) {
            for(const [key, value] of Object.entries(template.parameters)) {
                sprite[key] = value
            }
        }
        return sprite
    }

    setFromTemplate(template) {
        if(template.image !== undefined) this.image = template.image
        if(template.pos !== undefined) {
            let pos = template.pos.toSprite()
            this.centerX = pos.centerX
            this.centerY = pos.centerY
        } else {
            if(template.centerX !== undefined) this.centerX = num(template.centerX)
            if(template.centerY !== undefined) this.centerY = num(template.centerY)
        }
        if(template.size !== undefined) {
            this.width = this.height = num(template.size)
        } else {
            if(template.width !== undefined) this.width = num(template.width)
            if(template.height !== undefined) this.height = num(template.height)
        }
        if(template.speed !== undefined) this.speed = num(template.speed)
        if(template.angle !== undefined) this.angle = rad(num(template.angle))
        if(template.imageAngle !== undefined) this.imageAngle = num(template.imageAngle)
        if(template.active !== undefined) this.active = template.active
        if(template.visible !== undefined) this.visible = template.visible
    }

    draw() {
        if(!this.image || !this.visible) return
        this.image.drawRotated(xToScreen(this.centerX), yToScreen(this.centerY)
            , distToScreen(this.width), distToScreen(this.height), this.imageAngle ?? this.angle, false)
    }

    move() {
        this.centerX += Math.cos(this.angle) * this.speed * apsk
        this.centerY += Math.sin(this.angle) * this.speed * apsk
    }

    turn(value) {
        this.angle += value
    }

    turnImage(value) {
        this.imageAngle += value
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    add(action) {
        this.actions.push(action)
    }

    // collisions

    collisionWith(object, code) {
        object.collisionWithSprite(this, code)
    }

    collisionWithSprite(sprite, code) {
        if(sprite.collidesWithSprite(this)) {
            code.call(null, sprite, this)
        }
    }

    collidesWithSprite(sprite) {
        let dx = this.centerX - sprite.centerX
        let dy = this.centerY - sprite.centerY
        let radius = this.halfWidth + sprite.halfWidth
        return dx * dx + dy * dy < radius * radius
    }

    toSprite() {
        return this
    }
}
