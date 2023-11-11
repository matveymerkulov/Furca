import {Renderable} from "./renderable.js"
import {rad, rnd, rndi} from "./system.js"

export default class Point extends Renderable {
    constructor(centerX = 0.0, centerY = 0.0) {
        super()
        this.centerX = centerX
        this.centerY = centerY
    }

    draw() {}

    update() {}

    move() {}

    moveTo(x, y) {
        this.centerX = x
        this.centerY = y
    }

    setPositionAs(point) {
        this.centerX = point.centerX
        this.centerY = point.centerY
    }

    moveToCircle(x, y, radius) {
        let angle = rad(rnd(360))
        radius = Math.sqrt(rnd(radius))
        this.centerX = x + radius * Math.cos(angle)
        this.centerY = y + radius * Math.sin(angle)
    }

    moveToPerimeter(bounds) {
        let dx = bounds.rightX - bounds.leftX
        let dy = bounds.bottomY - bounds.topY
        if (rnd(dx + dy) < dx) {
            this.centerX = rnd(bounds.leftX, bounds.rightX)
            this.centerY = rndi(2) ? bounds.topY : bounds.bottomY
        } else {
            this.centerX = rndi(2) ? bounds.leftX : bounds.rightX
            this.centerY = rnd(bounds.topY, bounds.bottomY)
        }
    }

    loop(bounds) {
        if(this.centerX < bounds.leftX) this.centerX += bounds.width
        if(this.centerX >= bounds.rightX) this.centerX -= bounds.width
        if(this.centerY < bounds.topY) this.centerY += bounds.height
        if(this.centerY >= bounds.bottomY) this.centerY -= bounds.height
    }

    distanceTo(point) {
        let dx = this.centerX - point.centerX
        let dy = this.centerY - point.centerY
        return Math.sqrt(dx * dx + dy * dy)
    }

    angleTo(x, y) {
        return Math.atan2(this.centerY - y, this.centerX - x)
    }
}