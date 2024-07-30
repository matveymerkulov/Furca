import Box from "./box.js"
import {clamp, unc} from "./system.js"

export let serviceSprite1 = new Box()
export let serviceSprite2 = new Box()

export function toCircle(pill, point, servicePill) {
    if(pill.halfWidth === pill.halfHeight) return pill
    if(pill.halfWidth > pill.halfHeight) {
        let dwidth = pill.halfWidth - pill.halfHeight
        servicePill.setPosition(clamp(point.x, pill.x - dwidth, pill.x + dwidth), pill.y)
        servicePill.size = pill.height
    } else {
        let dheight = pill.halfHeight - pill.halfWidth
        servicePill.setPosition(pill.x, clamp(point.y, pill.y - dheight, pill.y + dheight))
        servicePill.size = pill.width
    }
    return servicePill
}


export function circleWithParamPointCollision(circle, x, y) {
    let dx = circle.x - x
    let dy = circle.y - y
    return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth
}

export function pointWithParamBoxCollision(point, x, y, width, height) {
    return point.x >= x && point.x < x + width && point.y >= y && point.y < y + height
}


export function pointWithCircleCollision(point, circle) {
    let dx = circle.x - point.x
    let dy = circle.y - point.y
    return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth
}

export function pointWithBoxCollision(point, box) {
    return point.x >= box.leftX && point.x < box.rightX && point.y >= box.topY && point.y < box.bottomY
}

export function pointWithPillCollision(point, pill) {
    return pointWithCircleCollision(point, toCircle(pill, point, serviceSprite1))
}


export function circleWithCircleCollision(circle1, circle2) {
    let dx = circle1.x - circle2.x
    let dy = circle1.y - circle2.y
    let radius = circle1.halfWidth + circle2.halfWidth
    return dx * dx + dy * dy < radius * radius
}

export function circleWithBoxCollision(circle, box) {
    if(!boxWithBoxCollision(circle, box)) return false

    if(circle.x >= box.leftX && circle.x < box.rightX) return true
    if(circle.y >= box.topY && circle.y < box.bottomY) return true

    let x = circle.x < box.x ? box.leftX : box.rightX
    let y = circle.y < box.y ? box.topY : box.bottomY
    return circleWithParamPointCollision(circle, x, y)
}

export function circleWithPillCollision(circle, pill) {
    if(!boxWithBoxCollision(pill, circle)) return false
    return circleWithCircleCollision(toCircle(pill, circle, serviceSprite1), circle)
}


export function boxWithBoxCollision(box1, box2) {
    return Math.abs(box1.x - box2.x) <= box1.halfWidth + box2.halfWidth
        && Math.abs(box1.y - box2.y) <= box1.halfHeight + box2.halfHeight
}

export function boxWithPillCollision(box, pill) {
    if(!boxWithBoxCollision(pill, box)) return false
    return circleWithBoxCollision(toCircle(pill, box, serviceSprite1), box)
}

//    return point.x >= box.leftX && point.x < box.rightX && point.y >= box.topY && point.y < box.y.bottomY
//If ( Rectangle.X - Rectangle.Width * 0.5 <= Oval.X And Oval.X <= Rectangle.X + Rectangle.Width * 0.5 )
// Or ( Rectangle.Y - Rectangle.Height * 0.5 <= Oval.Y And Oval.Y <= Rectangle.Y + Rectangle.Height * 0.5 ) Then


export function pillWithPillCollision(pill1, pill2) {
    if(!boxWithBoxCollision(pill1, pill2)) return false
    return circleWithCircleCollision(toCircle(pill1, pill2, serviceSprite1), toCircle(pill2, pill1, serviceSprite2))
}