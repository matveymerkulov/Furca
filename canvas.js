import Sprite from "./sprite.js"
import Area from "./area.js"
import {ctx, mousesx, mousesy} from "./system.js"
import {project} from "./project.js"

export let currentCanvas, zk = 1.2

export function setCurrentCanvas(canvas) {
    currentCanvas = canvas
}

export default class Canvas extends Sprite {
    constructor(centerX, centerY, width, height, active, viewport) {
        super(undefined, centerX, centerY, width, height, 0.0, 0.0, 0, active)
        this.viewport = viewport
        this._vdx = 1.0
        this._vdy = 1.0
        this._k = 1.0
        this._oldZoom = 0
        this._defaultPosition = this
        this.update()
    }

    static create(fwidth, fheight, swidth, sheight, active = true) {
        return new Canvas(0.0, 0.0, fwidth, fheight, active, new Area(0, 0
            , swidth, sheight))
    }

    draw() {
        if(!this.active) return
        let viewport = this.viewport
        let oldCanvas = currentCanvas
        currentCanvas = this
        this.update()

        ctx.fillStyle = project.background

        //g.setClip(viewport.leftX, viewport.topY, viewport.width, viewport.height)
        ctx.fillRect(viewport.leftX, viewport.topY, viewport.width, viewport.height)
        for(let i = 0; i < project.scene.length; i++) {
            project.scene[i].draw()
        }

        currentCanvas = oldCanvas

        ctx.fillStyle = "white"
    }

    update() {
        let viewport = this.viewport
        let k = 1.0 * viewport.width / this.width
        this._k = k
        this.height = 1.0 * viewport.height / k
        this._vdx = 0.5 * viewport.width - this.centerX * k + viewport.leftX
        this._vdy = 0.5 * viewport.height - this.centerY * k + viewport.topY
    }

    setZoom(zoom) {
        this.width = this.viewport.width * (zk ** zoom)
        this.update()
    }

    setZoomXY(zoom, x, y) {
        let fx1 = xFromScreen(x)
        let fy1 = yFromScreen(y)
        this.setZoom(zoom)
        let fx2 = xFromScreen(x)
        let fy2 = yFromScreen(y)
        this.centerX += fx1 - fx2
        this.centerY += fy1 - fy2
        this.update()
    }

    hasMouse() {
        return this.viewport.hasPoint(mousesx, mousesy)
    }

    setDefaultPosition() {
        this._oldZoom = this.zoom
        this._defaultPosition = new Sprite(undefined, undefined, this.centerX, this.centerY, this.width, this.height)
    }

    restorePosition() {
        let defaultPosition = this._defaultPosition
        this.centerX = defaultPosition.centerX
        this.centerY = defaultPosition.centerY
        this.width = defaultPosition.width
        this.height = defaultPosition.height
        this.zoom = this._oldZoom
        this.update()
    }

    drawDefaultCamera() {
        let pos = this._defaultPosition
        ctx.fillStyle("blue")
        drawRect(xToScreen(pos.leftX), yToScreen(pos.topY), distToScreen(pos.width), distToScreen(pos.height))
        ctx.fillStyle("white")
    }

    toggle() {
        this.active = !this.active
    }
}

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

export function xToScreen(fieldX) {
    return fieldX * currentCanvas._k + currentCanvas._vdx
}
export function yToScreen(fieldY) {
   return fieldY * currentCanvas._k + currentCanvas._vdy
}
export function distToScreen(fieldDist) {
    return fieldDist * currentCanvas._k
}

export function xFromScreen(screenX) {
    return (screenX - currentCanvas._vdx) / currentCanvas._k
}
export function yFromScreen(screenY) {
    return (screenY - currentCanvas._vdy) / currentCanvas._k
}

export function distFromScreen(screenDist) {
    return screenDist / currentCanvas._k
}

export function setCanvas(canvas) {
    currentCanvas = canvas
}