import {ctx} from "./canvas.js"

let dashes = [
    [4, 4],
    [0, 1, 4, 3],
    [0, 2, 4, 2],
    [0, 3, 4, 1],
    [0, 4, 4, 0],
    [1, 4, 3, 0],
    [2, 4, 2, 0],
    [3, 4, 1, 0],
]

export function drawDashedRegion(x, y, width, height, isCircle = false) {
    function draw() {
        if(isCircle) {
            ctx.beginPath()
            ctx.ellipse(x + 0.5 * width,  y + 0.5 * height, 0.5 * width, 0.5 * height, 0, 0, 2.0 * Math.PI)
            ctx.stroke()
        } else {
            ctx.strokeRect(x, y, width, height)
        }
    }

    x = Math.floor(x)
    y = Math.floor(y)
    width = Math.floor(width)
    height = Math.floor(height)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    draw()
    let shift = Math.floor(new Date().getTime() / 100) % 8
    ctx.setLineDash(dashes[shift])
    ctx.strokeStyle = "white"
    draw()
    ctx.setLineDash([])
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
}

export function drawRect(innerColor, outerColor, x, y, width, height) {
    x = Math.floor(x)
    y = Math.floor(y)
    width = Math.floor(width)
    height = Math.floor(height)
    ctx.strokeStyle = innerColor
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    ctx.strokeStyle = outerColor
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)
    ctx.strokeStyle = "black"
}