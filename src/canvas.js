import Sprite from "./sprite.js"
import {mouse, screenMouse} from "./system.js"
import Box from "./box.js"
import {project} from "./project.js"

export let currentCanvas, ctx, zk = 1.2

export function setCanvas(canvas) {
    currentCanvas = canvas
    ctx = canvas.node.getContext("2d")
    mouse.moveTo(xFromScreen(screenMouse.x), yFromScreen(screenMouse.y))
}

export default class Canvas extends Sprite {
    constructor(node, x, y, width, height, active, viewport) {
        super(undefined, x, y, width, height, 0.0, 0.0, 0, active)
        this.node = node
        this.viewport = viewport
        this._vdx = 1.0
        this._vdy = 1.0
        this._k = 1.0
        this._oldZoom = 0
        this._defaultPosition = this
        this.background = "black"
        this.updateParameters()
    }

    static create(node, fwidth, fheight, active = true) {
        node.width = node.clientWidth
        node.height = node.clientHeight
        return new Canvas(node,0.0, 0.0, fwidth, fheight, active, Box.fromArea(node.offsetLeft
            , node.offsetTop, node.width, node.height))
    }

    render() {
        if(!this.active) return

        this.updateParameters()
        let viewport = this.viewport
        setCanvas(this)

        ctx.fillStyle = this.background
        //g.setClip(viewport.leftX, viewport.topY, viewport.width, viewport.height)
        ctx.fillRect(0, 0, viewport.width, viewport.height)

        ctx.fillStyle = "white"

        this.renderContents()
    }

    renderContents() {
        project.scene.draw()
    }

    updateParameters() {
        let viewport = this.viewport
        let k = 1.0 * viewport.width / this.width
        this._k = k
        this.height = 1.0 * viewport.height / k
        this._vdx = 0.5 * viewport.width - this.x * k
        this._vdy = 0.5 * viewport.height - this.y * k
    }

    setZoom(zoom) {
        this.zoom = zoom
        this.width = this.viewport.width * (zk ** zoom)
        this.updateParameters()
    }

    setZoomXY(zoom, x, y) {
        let fx1 = xFromScreen(x)
        let fy1 = yFromScreen(y)
        this.setZoom(zoom)
        let fx2 = xFromScreen(x)
        let fy2 = yFromScreen(y)
        this.x += fx1 - fx2
        this.y += fy1 - fy2
        this.updateParameters()
    }

    hasMouse() {
        return this.viewport.collidesWithPoint(mouse.x, mouse.y)
    }

    setDefaultPosition() {
        this._oldZoom = this.zoom
        this._defaultPosition = new Sprite(undefined, undefined, this.x, this.y, this.width, this.height)
    }

    restorePosition() {
        let defaultPosition = this._defaultPosition
        this.x = defaultPosition.x
        this.y = defaultPosition.y
        this.width = defaultPosition.width
        this.height = defaultPosition.height
        this.zoom = this._oldZoom
        this.updateParameters()
    }

    drawDefaultCamera() {
        let pos = this._defaultPosition
        ctx.fillStyle("blue")
        ctx.strokeRect(xToScreen(pos.leftX), yToScreen(pos.topY), distToScreen(pos.width), distToScreen(pos.height))
        ctx.fillStyle("white")
    }

    toggle() {
        this.active = !this.active
    }
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