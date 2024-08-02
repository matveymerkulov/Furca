import {Renderable} from "./renderable.js"
import {rad, rnd, rndi} from "./system.js"

export default class Point extends Renderable {
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

    moveToCircle(x, y, radius) {
        let angle = rad(rnd(360))
        radius = Math.sqrt(rnd(radius))
        this.x = x + radius * Math.cos(angle)
        this.y = y + radius * Math.sin(angle)
    }

    moveToPerimeter(bounds) {
        let dx = bounds.rightX - bounds.leftX
        let dy = bounds.bottomY - bounds.topY
        if (rnd(dx + dy) < dx) {
            this.x = rnd(bounds.leftX, bounds.rightX)
            this.y = rndi(2) ? bounds.topY : bounds.bottomY
        } else {
            this.x = rndi(2) ? bounds.leftX : bounds.rightX
            this.y = rnd(bounds.topY, bounds.bottomY)
        }
    }

    wrap(bounds) {
        while(this.x < bounds.leftX) this.x += bounds.width
        while(this.x >= bounds.rightX) this.x -= bounds.width
        while(this.y < bounds.topY) this.y += bounds.height
        while(this.y >= bounds.bottomY) this.y -= bounds.height
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
}