import {Box} from "./box.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {Img} from "./image.js"
import {boxWithBoxCollision, boxWithPillCollision, circleWithBoxCollision, circleWithCircleCollision, circleWithPillCollision, pillWithPillCollision} from "./collisions.js"
import {boxFromBoxVector, circleFromBoxVector, circleFromCircleVector, circleFromPillVector, pillFromBoxVector, pillFromPillVector,} from "./physics.js"
import {Action} from "./actions/action.js";
import {ShapeType} from "./shape_type"

export class Sprite extends Box {
    angle = 0.0
    opacity = 1.0
    flipped = false
    actions: Action[] = []

    constructor(public image: Img = undefined, x = 0.0, y = 0.0, width = 1.0, height = 1.0
                , public shapeType = ShapeType.circle, public imageAngle: number = 0
                , public active = true, public visible = true) {
        super(x, y, width, height)
        this.opacity = 1.0
        this.flipped = false
    }

    add(...actions: Array<Action>) {
        this.actions.push(...actions)
    }

    draw() {
        if(!this.image || !this.visible) return
        ctx.globalAlpha = this.opacity

        this.image.drawRotated(xToScreen(this.x), yToScreen(this.y), distToScreen(this.width)
            , distToScreen(this.height), this.shapeType, this.imageAngle ?? this.angle, this.flipped)

        ctx.globalAlpha = 1.0
    }

    update() {
        for(const action of this.actions) {
            action.execute()
        }
    }

    turnImage(value: number) {
        this.imageAngle += value
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    // collisions

    collidesWithSprite(sprite: Sprite) {
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
            case ShapeType.box:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        return circleWithBoxCollision(sprite, this)
                    case ShapeType.box:
                        return boxWithBoxCollision(this, sprite)
                    case ShapeType.pill:
                        return boxWithPillCollision(this, sprite)
                }
            case ShapeType.pill:
                switch(sprite.shapeType) {
                    case ShapeType.circle:
                        return circleWithPillCollision(sprite, this)
                    case ShapeType.box:
                        return boxWithPillCollision(sprite, this)
                    case ShapeType.pill:
                        return pillWithPillCollision(this, sprite)
                }
        }
    }

    pushFromSprite(sprite: Sprite, k = 1.0) {
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