import {Point} from "./point.js"
import {unc} from "./system.js"
import {drawDashedRegion} from "./draw.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"

export class Box extends Point {
    constructor(x = 0.0, y = 0.0, width = 0.0, height = 0.0) {
        super(x, y)
        this.halfWidth = 0.5 * width
        this.halfHeight = 0.5 * height
    }

    static fromArea(leftX, topY, width, height) {
        return new Box(leftX + 0.5 * width, topY + 0.5 * height, width, height)
    }

    get size() {
        return this.halfWidth * 2.0
    }
    set size(value) {
        this.halfWidth = this.halfHeight = value * 0.5
    }

    get radius() {
        return this.halfWidth
    }
    set radius(value) {
        this.halfWidth = this.halfHeight = value
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
        return this.x - this.halfWidth
    }
    set leftX(value) {
        this.x = value + this.halfWidth
    }

    get topY() {
        return this.y - this.halfHeight
    }
    set topY(value) {
        this.y = value + this.halfHeight
    }

    get rightX() {
        return this.x + this.halfWidth
    }
    set rightX(value) {
        this.x = value - this.halfWidth
    }

    get bottomY() {
        return this.y + this.halfHeight
    }
    set bottomY(value) {
        this.y = value - this.halfHeight
    }

    setCorner(x, y) {
        this.leftX = x
        this.topY = y
    }

    setSize(width, height) {
        this.width = width
        this.height = height
    }

    alterSize(dWidth, dHeight) {
        this.width += dWidth
        this.height += dHeight
    }

    setSizeAs(shape) {
        this.width = shape.width
        this.height = shape.height
    }

    drawDashedRegion(isCircle) {
        drawDashedRegion(xToScreen(this.leftX), yToScreen(this.topY), distToScreen(this.width), distToScreen(this.height)
            , isCircle)
    }

    limit(box) {
        if(this.leftX < box.leftX) this.leftX = box.leftX + unc
        if(this.rightX > box.rightX) this.rightX = box.rightX - unc
        if(this.topY < box.topY) this.topY = box.topY + unc
        if(this.bottomY > box.bottomY) this.bottomY = box.bottomY - unc
    }

    collidesWithPoint(x, y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY
    }

    firstCollisionWithPoint(x, y) {
        return this.collidesWithPoint(x, y) ? this : undefined
    }

    collisionWithPoint(x, y, code) {
        if(this.collidesWithPoint(x, y)) code.call(null, x, y, this)
    }

    overlaps(box) {
        return box.leftX >= this.leftX && box.topY >= this.topY && box.rightX < this.rightX
            && box.bottomY < this.bottomY
    }

    isInside(box) {
        return box.overlaps(this)
    }
}