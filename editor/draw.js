import {ctx} from "../src/canvas.js"
import {atan2, cos, rad, sin} from "../src/functions.js"

export function drawShape(x, y, parameters, type) {
    if(parameters.hasOwnProperty("outline")) {
        drawShape(x, y, parameters.outline, parameters.type)
    }

    ctx.strokeStyle = parameters.color
    ctx.lineWidth = parameters.lineWidth
    const size = parameters.size

    ctx.beginPath()
    switch(type === undefined ? parameters.type : type) {
        case "x":
            ctx.moveTo(x - size, y - size)
            ctx.lineTo(x + size, y + size)
            ctx.moveTo(x + size, y - size)
            ctx.lineTo(x - size, y + size)
            ctx.stroke()
            break
        case "+":
            ctx.moveTo(x, y - size)
            ctx.lineTo(x, y + size)
            ctx.moveTo(x + size, y)
            ctx.lineTo(x - size, y)
            ctx.stroke()
            break
        case "o":
            const radius = 0.5 * parameters.size
            ctx.ellipse(x, y, radius, radius, 0, 0, rad(360))
            ctx.fill()
            break
        default:
            throw Error("invalid shape type")
    }
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
            ctx.ellipse(x + 0.5 * width, y + 0.5 * height, 0.5 * width, 0.5 * height, 0, 0, 2.0 * Math.PI)
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
    ctx.lineWidth = 1
}

export function drawRect(x, y, width, height, parameters, padding) {
    if(parameters.hasOwnProperty("outline")) {
        drawRect(x, y, width, height, parameters.outline, parameters.padding)
    }

    if(padding === undefined) padding = parameters.hasOwnProperty("padding") ? parameters.padding : 0
    const padding2 = padding * 2.0

    ctx.strokeStyle = parameters.color
    ctx.lineWidth = parameters.lineWidth
    ctx.strokeRect(Math.floor(x + padding + 1), Math.floor(y + padding + 1)
        , Math.floor(width - padding2), Math.floor(height - padding2))
    ctx.strokeStyle = "white"
}