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

    setPositionAs(point) {
        this.x = point.x
        this.y = point.y
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

    loop(bounds) {
        if(this.x < bounds.leftX) this.x += bounds.width
        if(this.x >= bounds.rightX) this.x -= bounds.width
        if(this.y < bounds.topY) this.y += bounds.height
        if(this.y >= bounds.bottomY) this.y -= bounds.height
    }

    distanceTo(point) {
        let dx = this.x - point.x
        let dy = this.y - point.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    angleTo(x, y) {
        return Math.atan2(this.y - y, this.x - x)
    }
}