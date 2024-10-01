import {Box} from "./box.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {num} from "./system.js"
import {Animate} from "./actions/sprite/animate.js"
import {
    boxWithBoxCollision,
    boxWithPillCollision,
    circleWithBoxCollision,
    circleWithCircleCollision,
    circleWithPillCollision,
    pillWithPillCollision
} from "./collisions.js"
import {
    boxFromBoxVector,
    circleFromBoxVector,
    circleFromCircleVector,
    circleFromPillVector,
    pillFromBoxVector,
    pillFromPillVector,
} from "./physics.js"
import {ShapeType} from "./shape.js"
import {Img} from "./image.js"
import {ImageArray} from "./image_array.js"

export class Sprite extends Box {
    shapeType
    image
    imageAngle
    visible
    active
    opacity
    flipped
    actions

    constructor(image, x = 0.0, y = 0.0, width = 1.0, height = 1.0
                , shapeType = ShapeType.circle, imageAngle, active = true, visible = true) {
        super(x, y, width, height)
        this.shapeType = shapeType
        this.image = image
        this.imageAngle = imageAngle
        this.visible = visible
        this.active = active
        this.opacity = 1.0
        this.flipped = false
        this.actions = []
    }

    static create(template, layer) {
        let sprite = new Sprite(Img.create(template.image), num(template.x), num(template.y), num(template.width)
            , num(template.height), template.shape, num(template.imageAngle), template.visible, template.active)
        sprite.init(template, layer)
        return sprite
    }

    init(template, layer) {
        if(template.size !== undefined) {
            this.width = this.height = num(template.size)
        }

        if(layer !== undefined) {
            layer.add(this)
        }

        if(template.images !== undefined) {
            const images = ImageArray.create(template.images)
            this.image = images.image(0)
            this.actions.push(new Animate(this, images, num(template.animationSpeed)))
        }

        if(template.parameters !== undefined) {
            for(const [key, value] of Object.entries(template.parameters)) {
                this[key] = value
            }
        }
        return this
    }

    add(...actions) {
        this.actions.push(...actions)
    }

    draw() {
        if(!this.image || !this.visible) return
        ctx.globalAlpha = this.opacity

        this.image.drawRotated(xToScreen(this.x), yToScreen(this.y)
            , distToScreen(this.width), distToScreen(this.height), this.shapeType, this.imageAngle ?? this.angle
            , this.flipped)

        ctx.globalAlpha = 1.0
    }

    update() {
        for(const action of this.actions) {
            action.execute()
        }
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

    processSprites(code) {
        code.call(this)
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

    collisionWithTileMap(tileMap, code) {
    }

    collidesWithSprite(sprite) {
        switch(this.shapeType) {
            case ShapeType.circle:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        return circleWithCircleCollision(this, sprite)
                    case ShapeType.box:
                        return circleWithBoxCollision(this, sprite)
                    case ShapeType.pill:
                        return circleWithPillCollision(this, sprite)
                }
                break
            case ShapeType.box:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        return circleWithBoxCollision(sprite, this)
                    case ShapeType.box:
                        return boxWithBoxCollision(this, sprite)
                    case ShapeType.pill:
                        return boxWithPillCollision(this, sprite)
                }
                break
            case ShapeType.pill:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        return circleWithPillCollision(sprite, this)
                    case ShapeType.box:
                        return boxWithPillCollision(sprite, this)
                    case ShapeType.pill:
                        return pillWithPillCollision(this, sprite)
                }
                break
        }
        return false
    }

    pushFromSprite(sprite, k = 1.0) {
        switch(this.shapeType) {
            case ShapeType.circle:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        circleFromCircleVector(this, sprite).addToSprite(this, k)
                        break
                    case ShapeType.box:
                        circleFromBoxVector(this, sprite).addToSprite(this, k)
                        break
                    case ShapeType.pill:
                        circleFromPillVector(this, sprite).addToSprite(this, k)
                        break
                }
                break
            case ShapeType.box:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        circleFromBoxVector(sprite, this).subtractFromSprite(this, k)
                        break
                    case ShapeType.box:
                        boxFromBoxVector(sprite, this).subtractFromSprite(this, k)
                        break
                    case ShapeType.pill:
                        pillFromBoxVector(this, sprite).addToSprite(this, k)
                        break
                }
                break
            case ShapeType.pill:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        circleFromPillVector(sprite, this).subtractFromSprite(this, k)
                        break
                    case ShapeType.box:
                        pillFromBoxVector(this, sprite).addToSprite(this, k)
                        break
                    case ShapeType.pill:
                        pillFromPillVector(this, sprite).addToSprite(this, k)
                        break
                }
                break
        }
    }

    toSprite() {
        return this
    }
}