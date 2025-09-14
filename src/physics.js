import {unc} from "./system.js"
import {toCircle} from "./collisions.js"
import {serviceSprite1, serviceSprite2} from "./box.js"


export class Vector {
    x
    y
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    get angle() {
        return Math.atan2(this.y, this.x)
    }

    multiplyBy(value) {
        this.x *= value
        this.y *= value
        return this
    }

    addToSprite(sprite, k = 1) {
        sprite.setPosition(k * (sprite.x + this.x), k * (sprite.y + this.y))
    }

    subtractFromSprite(sprite, k = 1) {
        sprite.setPosition(k * (sprite.x - this.x), k * (sprite.y - this.y))
    }

    normalize() {
        let length = Math.sqrt(this.x * this.x + this.y * this.y)
        this.x /= length
        this.y /= length
        return this
    }
}


export function circleFromCircleVector(circle, fromCircle) {
    let dx = circle.x - fromCircle.x
    let dy = circle.y - fromCircle.y
    let length = Math.sqrt(dx * dx + dy * dy)
    let k = (circle.halfWidth + fromCircle.halfWidth + unc) / length
    return new Vector(fromCircle.x - circle.x + dx * k, fromCircle.y - circle.y + dy * k)
}


export function circleFromBoxVector(circle, fromBox) {
    if(circle.x >= fromBox.left && circle.x < fromBox.right
            || circle.y >= fromBox.top && circle.y < fromBox.bottom) {
        return boxFromBoxVector(circle, fromBox)
    } else {
        serviceSprite1.x = circle.x < fromBox.x ? fromBox.left : fromBox.right
        serviceSprite1.y = circle.y < fromBox.y ? fromBox.top : fromBox.bottom
        serviceSprite1.radius = 0
        return circleFromCircleVector(circle, serviceSprite1)
    }
}


export function circleFromPillVector(circle, fromPill) {
    let circle2 = toCircle(fromPill, circle, serviceSprite2)
    let k = (circle.halfWidth + circle2.halfWidth) / circle.distanceTo(circle2) - 1.0
    return new Vector((circle.x - circle2.x) * k, (circle.y - circle2.y) * k)
}


export function boxFromBoxVector(box, fromBox) {
    let dx = box.x - fromBox.x
    let dy = box.y - fromBox.y
    let dwidth = box.halfWidth + fromBox.halfWidth + unc
    let dheight = box.halfHeight + fromBox.halfHeight + unc
    if(dwidth - Math.abs(dx) < dheight - Math.abs(dy)) {
        return new Vector(fromBox.x - box.x + Math.sign(dx) * dwidth, 0)
    } else {
        return new Vector(0, fromBox.y - box.y + Math.sign(dy) * dheight)
    }
}


export function pillFromBoxVector(box, fromPill) {
    let dx = fromPill.x - box.x
    let dy = fromPill.y - box.y
    let xDistance = Math.abs(dx)
    let yDistance = Math.abs(dy)
    let a = yDistance * box.width >= xDistance * box.height
    if(fromPill.x > box.left && fromPill.x < box.right && a) {
        return new Vector(0, (box.halfHeight + fromPill.halfHeight - yDistance) * -Math.sign(dy))
    } else if (fromPill.y > box.top && fromPill.y < box.bottom && !a) {
        return new Vector((box.halfWidth + fromPill.halfWidth - xDistance) * -Math.sign(dx), 0)
    } else {
        serviceSprite1.x = box.x + box.halfWidth * Math.sign(dx)
        serviceSprite1.y = box.y + box.halfHeight * Math.sign(dy)
        toCircle(fromPill, serviceSprite1, serviceSprite2)
        let k = 1.0 - serviceSprite2.halfWidth / serviceSprite2.distanceTo(serviceSprite1)
        return new Vector( (serviceSprite2.x - serviceSprite1.x) * k, (serviceSprite2.y - serviceSprite1.y) * k)
    }
}


export function pillFromPillVector(pill, fromPill) {
    let circle1 = toCircle(pill, fromPill, serviceSprite1)
    let circle2 = toCircle(fromPill, pill, serviceSprite2)
    let k = (circle1.halfWidth + circle2.halfWidth) / circle1.distanceTo(circle2) - 1.0
    return new Vector((circle1.x - circle2.x) * k, (circle1.y - circle2.y) * k)
}