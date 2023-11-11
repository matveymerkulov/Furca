import Box from "./box.js"
import {unc} from "./system.js"

function circleFromCircleVector(circle, fromCircle) {
    let dx = circle.centerX - fromCircle.centerX
    let dy = circle.centerY - fromCircle.centerY
    let length = Math.sqrt(dx * dx + dy * dy)
    let k = (circle.halfWidth + fromCircle.halfWidth + unc) / length
    return {
        x: fromCircle.centerX - circle.centerX + dx * k,
        y: fromCircle.centerY - circle.centerY + dy * k,
    }

}

export function pushCircleFromCircle(circle, fromCircle) {
    let vector = circleFromCircleVector(circle, fromCircle)
    circle.centerX += vector.x
    circle.centerY += vector.y
}

export function circleFromBoxVector(circle, fromBox) {
    if(circle.centerX >= fromBox.leftX && circle.centerX < fromBox.rightX
            || circle.centerY >= fromBox.topY && circle.centerY < fromBox.bottomY) {
        return boxFromBoxVector(circle, fromBox)
    } else {
        let x = circle.centerX < fromBox.centerX ? fromBox.leftX : fromBox.rightX
        let y = circle.centerY < fromBox.centerY ? fromBox.topY : fromBox.bottomY
        return circleFromCircleVector(circle, new Box(x, y, 0, 0))
    }
}

export function pushCircleFromBox(circle, fromBox) {
    let vector = circleFromBoxVector(circle, fromBox)
    circle.centerX += vector.x
    circle.centerY += vector.y
}

export function pushBoxFromCircle(box, fromCircle) {
    let vector = circleFromBoxVector(fromCircle, box)
    box.centerX -= vector.x
    box.centerY -= vector.y
}

export function boxFromBoxVector(box, fromBox) {
    let dx = box.centerX - fromBox.centerX
    let dy = box.centerY - fromBox.centerY
    let dwidth = box.halfWidth + fromBox.halfWidth + unc
    let dheight = box.halfHeight + fromBox.halfHeight + unc
    if(dwidth - Math.abs(dx) < dheight - Math.abs(dy)) {
        return {
            x: fromBox.centerX - box.centerX + Math.sign(dx) * dwidth,
            y: 0,
        }
    } else {
        return {
            x: 0,
            y: fromBox.centerY - box.centerY + Math.sign(dy) * dheight,
        }
    }
}

export function pushBoxFromBox(box, fromBox) {
    let vector = boxFromBoxVector(box, fromBox)
    box.centerX += vector.x
    box.centerY += vector.y
}