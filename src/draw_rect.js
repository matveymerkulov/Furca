import {ctx} from "./canvas.js"


export function drawRect(x, y, width, height) {
    let x2 = x + width
    let y2 = y + height
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x, y2)
    ctx.lineTo(x, y)
    ctx.stroke()
}