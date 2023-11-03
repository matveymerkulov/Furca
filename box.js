import Point from "./point.js"

export default class Box extends Point {
    constructor(centerX = 0.0, centerY = 0.0,  width = 1.0, height = 1.0) {
        super(centerX, centerY)
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

    setSizeAs(shape) {
        this.width = shape.width
        this.height = shape.height
    }

    collidesWithPoint(x, y) {
        return x >= this.leftX && x < this.rightX && y >= this.topY && y < this.bottomY
    }

    overlaps(box) {
        return box.leftX >= this.leftX && box.topY >= this.topY && box.rightX < this.rightX
            && box.bottomY < this.bottomY
    }
}