import {Box} from "./box.js"
import {Sprite} from "./sprite.js"
import {canvasMouse, mouse, screenMouse} from "./system.js"
import {project} from "./project.js"

export let currentCanvas, canvasUnderCursor, ctx, zk = 1.2

export function setCanvas(canvas) {
    currentCanvas = canvas
    if(canvas.node === undefined) return
    ctx = canvas.node.getContext("2d")
    let rect = canvas.node.getBoundingClientRect()
    canvasMouse.setPosition(screenMouse.x - rect.left, screenMouse.y - rect.top)
    mouse.setPosition(xFromScreen(canvasMouse.x), yFromScreen(canvasMouse.y))
}

export class Canvas extends Box {
    _vdx = 1.0
    _vdy = 1.0
    _k = 1.0
    background = "black"
    actions = []
    active = true
    viewport = new Box(0, 0, 1, 1)

    constructor(node, x, y, width, height) {
        super(x, y, width, height)

        if(node !== undefined) {
            this.node = node
            node.addEventListener("mouseover", () => {
                canvasUnderCursor = this
            })
            node.addEventListener("mouseout", () => {
                canvasUnderCursor = undefined
            })
        }

        this.updateParameters()
    }

    // sx = fx * k + dx
    // sy = fy * k + dy
    // dx = sx - fx * k
    // dy = sy - fy * k

    static createAdaptive(node, x, y, minWidth, minHeight) {
        const canvas = new Canvas(node, x, y, minWidth, minHeight)
        window.onresize = function() {
            canvas.viewport.x = 0.5 * node.offsetWidth
            canvas.viewport.y = 0.5 * node.offsetHeight
            canvas.viewport.width = node.offsetWidth
            canvas.viewport.height = node.offsetHeight
            node.width = node.offsetWidth
            node.height = node.offsetHeight
            canvas._k = Math.min( node.offsetWidth / minWidth, node.offsetHeight / minHeight)
            canvas.updateParameters()
        }
        window.onresize()
        return canvas
    }

    renderNode() {
        this.updateParameters()
        setCanvas(this)

        ctx.fillStyle = this.background
        ctx.fillRect(0, 0, this.viewport.width, this.viewport.height)
        ctx.fillStyle = "white"

        this.render()
    }

    render() {
        project.scene.draw()
    }

    updateNode() {
        if(!this.active) return
        // || !this.viewport.collidesWithPoint(screenMouse.x, screenMouse.y)
        setCanvas(this)
        this.update()
        for(let action of this.actions) {
            action.execute()
        }
    }

    update() {
    }

    add(drag, key) {
        drag.key = key
        this.actions.push(drag)
    }

    updateParameters() {
        this._vdx = this.viewport.halfWidth - this.x * this._k
        this._vdy = this.viewport.halfHeight - this.y * this._k
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