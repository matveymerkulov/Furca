import {num, unc} from "./system.js"
import {boxWithBoxCollision, boxWithPillCollision, circleWithBoxCollision, circleWithCircleCollision, circleWithPillCollision, pillWithPillCollision} from "./collisions.js"
import {boxFromBoxVector, circleFromBoxVector, circleFromCircleVector, circleFromPillVector, pillFromBoxVector, pillFromPillVector,} from "./physics.js"
import {rad, rnd, rndi} from "./functions.js"

export let ShapeType = {
    circle: 0,
    box: 1,
    pill: 2,
}

export class Sprite extends PIXI.AnimatedSprite {
    #shapeHalfWidth
    #shapeHalfHeight
    shapeType
    active
    actions

    constructor(textureArray, x = 0, y = 0, width = 1, height = 1,
                shapeType = ShapeType.circle, angle = 0, active = true, visible = true) {
        super(textureArray instanceof PIXI.Texture ? [textureArray] :
            (textureArray === undefined ? undefined : textureArray.textures) )
        this.position.set(x, y)
        this.setSize(width, height)
        this.#shapeHalfWidth = 0.5 * width
        this.#shapeHalfHeight = 0.5 * height
        this.shapeType = shapeType
        this.angle = angle
        this.active = active
        this.visible = visible
        this.actions = []

        this.widthMul = 1
        this.heightMul = 1

        this.anchor.set(0.5, 0.5)
    }


    get shapeX() {
        return this.x
    }
    set shapeX(value) {
        this.x = value
    }


    get shapeY() {
        return this.y
    }
    set shapeY(value) {
        this.y = value
    }

    
    get shapeHalfWidth() {
        return this.#shapeHalfWidth
    }
    get shapeHalfHeight() {
        return this.#shapeHalfHeight
    }


    get size() {
        return this.#shapeHalfWidth * 2.0
    }
    set size(value) {
        this.setSize(value, value)
    }


    get radius() {
        return this.#shapeHalfWidth
    }
    set radius(value) {
        this.setSize(value, value)
    }


    get shapeWidth() {
        return this.#shapeHalfWidth * 2.0
    }
    set shapeWidth(value) {
        this.#shapeHalfWidth = value * 0.5
        this.width = value * this.widthMul / this.texture.width
    }


    get shapeHeight() {
        return this.#shapeHalfHeight * 2.0
    }
    set shapeHeight(value) {
        this.#shapeHalfHeight = value * 0.5
        this.height = value * this.heightMul / this.texture.height
    }


    get left() {
        return this.x - this.#shapeHalfWidth
    }
    set left(value) {
        this.x = value + this.#shapeHalfWidth
    }


    get top() {
        return this.y - this.#shapeHalfHeight
    }
    set top(value) {
        this.y = value + this.#shapeHalfHeight
    }


    get right() {
        return this.x + this.#shapeHalfWidth
    }
    set right(value) {
        this.x = value - this.#shapeHalfWidth
    }


    get bottom() {
        return this.y + this.#shapeHalfHeight
    }
    set bottom(value) {
        this.y = value - this.#shapeHalfHeight
    }


    setSize(width, height) {
        if(height === undefined) { // noinspection JSSuspiciousNameCombination
            height = width
        }
        this.#shapeHalfWidth = 0.5 * width
        this.#shapeHalfHeight = 0.5 * height
        this.scale.set(width / this.texture.width, height / this.texture.height)
    }

    setShapePosition(x, y) {
        this.position.set(x, y)
    }

    setShapePositionAs(sprite, dx = 0, dy = 0) {
        this.position.set(sprite.x + dx, sprite.y + dy)
    }

    shiftShape(dx, dy) {
        this.position.set(this.x + dx, this.y + dy)
    }

    setShapeCorner(x, y) {
        this.left = x
        this.top = y
    }

    setShapeSize(width, height) {
        this.#shapeHalfWidth = width * 0.5
        this.#shapeHalfHeight = height * 0.5
        this.setSize(width * this.widthMul, height + this.heightMul)
    }

    alterShapeSize(dWidth, dHeight) {
        this.setShapeSize(this.shapeWidth + dWidth, this.shapeHeight + dHeight)
    }

    setShapeSizeAs(shape) {
        this.setShapeSize(shape.shapeWidth, shape.shapeHeight)
    }

    moveToCircle(x, y, radius) {
        let angle = rad(rnd(360))
        radius = Math.sqrt(rnd(radius))
        this.position.set(x + radius * Math.cos(angle), y + radius * Math.sin(angle))
    }

    moveToPerimeter(area) {
        const bounds = area.bounds
        let dx = bounds.maxX - bounds.minX
        let dy = bounds.maxY - bounds.minY
        if (rnd(dx + dy) < dx) {
            this.x = rnd(bounds.minX, bounds.maxX)
            this.y = rndi(2) ? bounds.minY : bounds.maxY
        } else {
            this.x = rndi(2) ? bounds.minX : bounds.maxX
            this.y = rnd(bounds.minY, bounds.maxY)
        }
    }

    wrap(area) {
        const bounds = area.bounds
        let x = this.x
        let y = this.y
        while(x < bounds.minX) x += bounds.width
        while(x >= bounds.maxX) x -= bounds.width
        while(y < bounds.minY) y += bounds.height
        while(y >= bounds.maxY) y -= bounds.height
        this.position.set(x, y)
    }

    distance2To(sprite) {
        let dx = this.x - sprite.x
        let dy = this.y - sprite.y
        return dx * dx + dy * dy
    }

    distanceTo(sprite) {
        return Math.sqrt(this.distance2To(sprite))
    }

    angleTo(x, y) {
        return Math.atan2(y - this.y, x - this.x)
    }

    angleToPoint(sprite) {
        return this.angleTo(sprite.x, sprite.y)
    }

    limit(box) {
        if(this.left < box.left) this.left = box.left + unc
        if(this.right > box.right) this.right = box.right - unc
        if(this.top < box.top) this.top = box.top + unc
        if(this.bottom > box.bottom) this.bottom = box.bottom - unc
    }


    add(...actions) {
        this.actions.push(...actions)
    }

    applyAction(action) {
        action.execute(this)
    }

    processSprites(code) {
        code.call(undefined, this)
    }

    // collisions

    update() {
        for(const action of this.actions) {
            action.execute(this)
        }
    }

    turnImage(value) {
        this.rotation.set(this.rotation + value)
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    // collisions

    collidesWithPoint(x, y) {
        return x >= this.left && x < this.right && y >= this.top && y < this.bottom
    }

    firstCollisionWithPoint(x, y) {
        return this.collidesWithPoint(x, y) ? this : undefined
    }

    collisionWithPoint(x, y, code) {
        if(this.collidesWithPoint(x, y)) code.call(null, x, y, this)
    }

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

    overlaps(sprite) {
        return sprite.left >= this.left && sprite.top >= this.top && sprite.right < this.right
            && sprite.bottom < this.bottom
    }

    isInside(sprite) {
        return sprite.overlaps(this)
    }

    toSprite() {
        return this
    }
}

export let collisionSprite = null// new Sprite(PIXI.Texture.EMPTY)
export let serviceSprite1 = null//new Sprite(PIXI.Texture.EMPTY)
export let serviceSprite2 = null//new Sprite(PIXI.Texture.EMPTY)