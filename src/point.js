import {Renderable} from "./renderable.js"
import {rad, rnd, rndi} from "./functions.js"

export class Point extends Renderable {
    constructor(x = 0.0, y = 0.0) {
        super()
        this.x = x
        this.y = y
    }

    draw() {}

    update() {}

    move() {}

    setPosition(x, y) {
        this.x = x
        this.y = y
    }

    setPositionAs(point, dx = 0, dy = 0) {
        this.x = point.x + dx
        this.y = point.y + dy
    }

    shift(dx, dy) {
        this.x += dx
        this.y += dy
    }

    moveToCircle(x, y, radius) {
        let angle = rad(rnd(360))
        radius = Math.sqrt(rnd(radius))
        this.x = x + radius * Math.cos(angle)
        this.y = y + radius * Math.sin(angle)
    }

    moveToPerimeter(bounds) {
        let dx = bounds.right - bounds.left
        let dy = bounds.bottom - bounds.top
        if (rnd(dx + dy) < dx) {
            this.x = rnd(bounds.left, bounds.right)
            this.y = rndi(2) ? bounds.top : bounds.bottom
        } else {
            this.x = rndi(2) ? bounds.left : bounds.right
            this.y = rnd(bounds.top, bounds.bottom)
        }
    }

    wrap(bounds) {
        while(this.x < bounds.left) this.x += bounds.width
        while(this.x >= bounds.right) this.x -= bounds.width
        while(this.y < bounds.top) this.y += bounds.height
        while(this.y >= bounds.bottom) this.y -= bounds.height
    }

    distance2To(point) {
        let dx = this.x - point.x
        let dy = this.y - point.y
        return dx * dx + dy * dy
    }

    distanceTo(point) {
        return Math.sqrt(this.distance2To(point))
    }

    angleTo(x, y) {
        return Math.atan2(y - this.y, x - this.x)
    }

    angleToPoint(point) {
        return this.angleTo(point.x, point.y)
    }

    processSprites(code) {
        code.call(undefined, this)
    }
}