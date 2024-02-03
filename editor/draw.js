import {ctx, xToScreen, yToScreen} from "../src/canvas.js"

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