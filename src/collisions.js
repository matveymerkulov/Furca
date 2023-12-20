export function boxWithPointCollision(point, x, y, width, height) {
    return point.x >= x && point.x < x + width && point.y >= y && point.y < y + height
}

export function circleWithPointCollision(circle, x, y) {
    let dx = circle.x - x
    let dy = circle.y - y
    return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth
}

export function circleWithCircleCollision(circle1, circle2) {
    let dx = circle1.x - circle2.x
    let dy = circle1.y - circle2.y
    let radius = circle1.halfWidth + circle2.halfWidth
    return dx * dx + dy * dy < radius * radius
}

export function boxWithBoxCollision(box1, box2) {
    return Math.abs(box1.x - box2.x) <= box1.halfWidth + box2.halfWidth
        && Math.abs(box1.y - box2.y) <= box1.halfHeight + box2.halfHeight
}

export function circleWithBoxCollision(circle, box) {
    if(!boxWithBoxCollision(circle, box)) return false
    if(circle.x >= box.leftX && circle.x < box.rightX) return true
    if(circle.y >= box.topY && circle.y < box.bottomY) return true
    let x = circle.x < box.x ? box.leftX : box.rightX
    let y = circle.y < box.y ? box.topY : box.bottomY
    return circleWithPointCollision(circle, x, y)
}