export function circleWithPointCollision(circle, x, y) {
    let dx = circle.centerX - x
    let dy = circle.centerY - y
    return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth
}

export function circleWithCircleCollision(circle1, circle2) {
    let dx = circle1.centerX - circle2.centerX
    let dy = circle1.centerY - circle2.centerY
    let radius = circle1.halfWidth + circle2.halfWidth
    return dx * dx + dy * dy < radius * radius
}

export function boxWithBoxCollision(box1, box2) {
    return Math.abs(box1.centerX - box2.centerX) <= box1.halfWidth + box2.halfWidth
        && Math.abs(box1.centerY - box2.centerY) <= box1.halfHeight + box2.halfHeight
}

export function circleWithBoxCollision(circle, box) {
    if(!boxWithBoxCollision(circle, box)) return false
    if(circle.centerX >= box.leftX && circle.centerX < box.rightX) return true
    if(circle.centerY >= box.topY && circle.centerY < box.bottomY) return true
    let x = circle.centerX < box.centerX ? box.leftX : box.rightX
    let y = circle.centerY < box.centerY ? box.topY : box.bottomY
    return circleWithPointCollision(circle, x, y)
}