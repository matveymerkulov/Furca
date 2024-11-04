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

    static fromArea(left, top, width, height) {
        return new Box(left + 0.5 * width, top + 0.5 * height, width, height)
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

    get left() {
        return this.x - this.halfWidth
    }
    set left(value) {
        this.x = value + this.halfWidth
    }

    get top() {
        return this.y - this.halfHeight
    }
    set top(value) {
        this.y = value + this.halfHeight
    }

    get right() {
        return this.x + this.halfWidth
    }
    set right(value) {
        this.x = value - this.halfWidth
    }

    get bottom() {
        return this.y + this.halfHeight
    }
    set bottom(value) {
        this.y = value - this.halfHeight
    }

    setCorner(x, y) {
        this.left = x
        this.top = y
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
        drawDashedRegion(xToScreen(this.left), yToScreen(this.top), distToScreen(this.width), distToScreen(this.height)
            , isCircle)
    }

    limit(box) {
        if(this.left < box.left) this.left = box.left + unc
        if(this.right > box.right) this.right = box.right - unc
        if(this.top < box.top) this.top = box.top + unc
        if(this.bottom > box.bottom) this.bottom = box.bottom - unc
    }

    collidesWithPoint(x, y) {
        return x >= this.left && x < this.right && y >= this.top && y < this.bottom
    }

    overlaps(box) {
        return box.left >= this.left && box.top >= this.top && box.right < this.right
            && box.bottom < this.bottom
    }

    isInside(box) {
        return box.overlaps(this)
    }
}


export let serviceSprite1 = new Box()
export let serviceSprite2 = new Box()