import {Renderable} from "./renderable.js"
import {rnd, rndi} from "./system.js"

export default class Shape extends Renderable {
    constructor(centerX = 0.0, centerY = 0.0,  width = 1.0, height = 1.0) {
        super()
        this.centerX = centerX
        this.centerY = centerY
        this.halfWidth = 0.5 * width
        this.halfHeight = 0.5 * height
    }

    get size() {
        return this.halfWidth * 2.0
    }

    set size(value) {
        this.halfWidth = this.halfHeight = value * 0.5
    }

    get width() {
        return this.halfWidth * 2.0
    }
    set width(value) {
        this.halfWidth = value * 0.5
    }

    get height() {
        return this.halfHeight * 2.0
    }
    set height(value) {
        this.halfHeight = value * 0.5
    }

    get leftX() {
        return this.centerX - this.halfWidth
    }
    set leftX(value) {
        this.centerX = value + this.halfWidth
    }

    get topY() {
        return this.centerY - this.halfHeight
    }
    set topY(value) {
        this.centerY = value + this.halfHeight
    }

    get rightX() {
        return this.centerX + this.halfWidth
    }
    set rightX(value) {
        this.centerX = value - this.halfWidth
    }

    get bottomY() {
        return this.centerY + this.halfHeight
    }
    set bottomY(value) {
        this.centerY = value - this.halfHeight
    }

    moveTo(x, y) {
        this.centerX = x
        this.centerY = y
    }

    moveToPerimeter(bounds) {
        let dx = bounds.rightX - bounds.leftX
        let dy = bounds.bottomY - bounds.topY
        if (rnd(0, dx + dy) < dx) {
            this.centerX = rnd(bounds.leftX, bounds.rightX)
            this.centerY = rndi(2) ? bounds.topY : bounds.bottomY
        } else {
            this.centerX = rndi(2) ? bounds.leftX : bounds.rightX
            this.centerY = rnd(bounds.topY, bounds.bottomY)
        }
    }

    setPositionAs(sprite) {
        this.centerX = sprite.centerX
        this.centerY = sprite.centerY
    }

    loop(bounds) {
        if(this.centerX < bounds.leftX) this.centerX += bounds.width
        if(this.centerX >= bounds.rightX) this.centerX -= bounds.width
        if(this.centerY < bounds.topY) this.centerY += bounds.height
        if(this.centerY >= bounds.bottomY) this.centerY -= bounds.height
    }

    setSizeAs(sprite) {
        this.width = sprite.width
        this.height = sprite.height
    }

    angleTo(sprite) {
        return Math.atan2(this.centerY - sprite.centerY, this.centerX - sprite.centerX)
    }

    collidesWithPoint(x, y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY
    }

    overlaps(shape) {
        return shape.leftX >= this.leftX && shape.topY >= this.topY && shape.rightX < this.rightX
            && shape.bottomY < this.bottomY
    }
}