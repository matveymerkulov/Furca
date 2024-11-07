import {ctx, distToScreen, xToScreen, yToScreen} from "../src/canvas.js"
import {atan2, cos, rad, sin} from "../src/functions.js"

export function drawCross(x, y, width, length, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    x = xToScreen(x)
    y = yToScreen(y)
    ctx.moveTo(x, y - length)
    ctx.lineTo(x, y + length)
    ctx.moveTo(x + length, y)
    ctx.lineTo(x - length, y)
    ctx.stroke()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1
}

export function drawX(x, y, width, length, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.moveTo(x - length, y - length)
    ctx.lineTo(x + length, y + length)
    ctx.moveTo(x + length, y - length)
    ctx.lineTo(x - length, y + length)
    ctx.stroke()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1
}

export function drawEllipse(x, y, width, height, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.ellipse(x + 0.5 * width,  y + 0.5 * height, 0.5 * width, 0.5 * height, 0, 0, 2.0 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "white"
}

export function drawArrow(x1, y1, x2, y2, parameters) {
    const angle = atan2(y2 - y1, x2 - x1)

    ctx.beginPath()
    ctx.lineWidth = parameters.lineWidth
    ctx.color = parameters.color

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)

    const length = parameters.pointerLength
    for(let i = -1; i <= 1; i += 2) {
        const a = angle + i * parameters.angle
        ctx.moveTo(x2, y2)
        ctx.lineTo(x2 + length * cos(a), y2 + length * sin(a))
    }

    ctx.stroke()
    ctx.color = "white"
    ctx.lineWidth = 1
}