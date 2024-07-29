import Box from "./box.js"
import {clamp, unc} from "./system.js"

function circleFromCircleVector(circle, fromCircle) {
    let dx = circle.x - fromCircle.x
    let dy = circle.y - fromCircle.y
    let length = Math.sqrt(dx * dx + dy * dy)
    let k = (circle.halfWidth + fromCircle.halfWidth + unc) / length
    return {
        x: fromCircle.x - circle.x + dx * k,
        y: fromCircle.y - circle.y + dy * k,
    }

}

export function pushCircleFromCircle(circle, fromCircle) {
    let vector = circleFromCircleVector(circle, fromCircle)
    circle.x += vector.x
    circle.y += vector.y
}


export function circleFromBoxVector(circle, fromBox) {
    if(circle.x >= fromBox.leftX && circle.x < fromBox.rightX
            || circle.y >= fromBox.topY && circle.y < fromBox.bottomY) {
        return boxFromBoxVector(circle, fromBox)
    } else {
        let x = circle.x < fromBox.x ? fromBox.leftX : fromBox.rightX
        let y = circle.y < fromBox.y ? fromBox.topY : fromBox.bottomY
        return circleFromCircleVector(circle, new Box(x, y, 0, 0))
    }
}

export function pushCircleFromBox(circle, fromBox) {
    let vector = circleFromBoxVector(circle, fromBox)
    circle.x += vector.x
    circle.y += vector.y
}

export function pushBoxFromCircle(box, fromCircle) {
    let vector = circleFromBoxVector(fromCircle, box)
    box.x -= vector.x
    box.y -= vector.y
}


export function boxFromBoxVector(box, fromBox) {
    let dx = box.x - fromBox.x
    let dy = box.y - fromBox.y
    let dwidth = box.halfWidth + fromBox.halfWidth + unc
    let dheight = box.halfHeight + fromBox.halfHeight + unc
    if(dwidth - Math.abs(dx) < dheight - Math.abs(dy)) {
        return {x: fromBox.x - box.x + Math.sign(dx) * dwidth, y: 0}
    } else {
        return {x: 0, y: fromBox.y - box.y + Math.sign(dy) * dheight}
    }
}

export function pushBoxFromBox(box, fromBox) {
    let vector = boxFromBoxVector(box, fromBox)
    box.x += vector.x
    box.y += vector.y
}
