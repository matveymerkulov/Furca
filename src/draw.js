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

export function drawDashedRect(x, y, width, height) {
    x = Math.floor(x)
    y = Math.floor(y)
    width = Math.floor(width)
    height = Math.floor(height)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)
    let shift = Math.floor(new Date().getTime() / 100) % 8
    ctx.setLineDash(dashes[shift])
    ctx.strokeStyle = "white"
    ctx.strokeRect(x, y, width, height)
    ctx.setLineDash([])
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
}

export function drawRect(color, x, y, width, height) {
    x = Math.floor(x)
    y = Math.floor(y)
    width = Math.floor(width)
    height = Math.floor(height)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)
    ctx.strokeStyle = "black"
}