import {atan2, rad, rnd, rndi, sqrt} from "./functions.js"
import {Box} from "./box.js";
import {SpriteCollisionProcessor, Shape} from "./shape.js";

export class Point extends Shape {
    x: number
    y: number

    constructor(x = 0.0, y = 0.0) {
        super()
        this.x = x
        this.y = y
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
    }

    setPositionAs(point: Point, dx = 0, dy = 0) {
        this.x = point.x + dx
        this.y = point.y + dy
    }

    moveToCircle(x: number, y: number, radius: number) {
        let angle = rad(rnd(360))
        radius = Math.sqrt(rnd(radius))
        this.x = x + radius * Math.cos(angle)
        this.y = y + radius * Math.sin(angle)
    }

    moveToPerimeter(bounds: Box) {
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

    wrap(bounds: Box) {
        while(this.x < bounds.left) this.x += bounds.width
        while(this.x >= bounds.right) this.x -= bounds.width
        while(this.y < bounds.top) this.y += bounds.height
        while(this.y >= bounds.bottom) this.y -= bounds.height
    }

    distance2To(point: Point) {
        let dx = this.x - point.x
        let dy = this.y - point.y
        return dx * dx + dy * dy
    }

    distanceTo(point: Point) {
        return sqrt(this.distance2To(point))
    }

    angleTo(x: number, y: number) {
        return atan2(y - this.y, x - this.x)
    }

    angleToPoint(point: Point) {
        return this.angleTo(point.x, point.y)
    }

    processSprites(code: (sprite: Point) => void) {
        code(this)
    }

    // collisions

    collidesWithPoint(x: number, y: number) {
        return x === this.x && y === this.y
    }

    firstCollisionWithPoint(x: number, y: number): Shape {
        return this.collidesWithPoint(x, y) ? this : undefined
    }

    collisionWithPoint(x: number, y: number, code: SpriteCollisionProcessor) {
        if(this.collidesWithPoint(x, y)) code(x, y, this)
    }

    isInside(box: Box) {
        return this.x >= box.left && this.x < box.right && this.y >= box.top && this.y < box.bottom
    }
}