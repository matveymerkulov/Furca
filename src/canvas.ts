import {Box} from "./box.js"
import {canvasMouse, mouse, screenMouse} from "./system.js"
import {project} from "./project.js"
import {Drag} from "./drag.js"
import {Key} from "./key.js"
import {Action} from "./actions/action"

export let currentCanvas: Canvas, canvasUnderCursor: Canvas, ctx: CanvasRenderingContext2D, zk = 1.2

export function setCanvas(canvas: Canvas) {
    currentCanvas = canvas
    if(canvas.node === undefined) return
    ctx = canvas.node.getContext("2d")
    let rect = canvas.node.getBoundingClientRect()
    canvasMouse.setPosition(screenMouse.x - rect.left, screenMouse.y - rect.top)
    mouse.setPosition(xFromScreen(canvasMouse.x), yFromScreen(canvasMouse.y))
}

export class Canvas extends Box {
    vdx = 1.0
    vdy = 1.0
    k = 1.0
    public zoom: number
    private oldZoom = 0
    private defaultPosition = this
    background = "black"
    actions: Action[] = []

    constructor(public node: HTMLCanvasElement = undefined, x: number, y: number, width: number, height: number
                , public viewport: Box, public active = true) {
        super(x, y, width, height)

        if(node !== undefined) {
            node.addEventListener("mouseover", () => {
                canvasUnderCursor = this
            })
            node.addEventListener("mouseout", () => {
                canvasUnderCursor = undefined
            })
        }

        this.updateParameters()
    }

    static create(node: HTMLCanvasElement, fwidth: number, fheight: number, adaptive = true) {
        const k = Math.min(window.innerWidth / fwidth, window.innerHeight / fheight)
        const width = adaptive ? fwidth * k : node.clientWidth
        const height = adaptive ? fheight * k : node.clientHeight
        node.width = width
        node.height = height// - document.getElementById("tabs").clientHeight * 2
        //node.style.width = width
        //node.style.height = height
        return new Canvas(node, 0.0, 0.0, fwidth, fheight, Box.fromArea(node.offsetLeft
            , node.offsetTop, width, height))
    }

    renderNode() {
        this.updateParameters()
        let viewport = this.viewport
        setCanvas(this)

        ctx.fillStyle = this.background
        //g.setClip(viewport.left, viewport.top, viewport.width, viewport.height)
        ctx.fillRect(0, 0, viewport.width, viewport.height)

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

    add(drag: Drag, key: Key = undefined) {
        drag.key = key
        this.actions.push(drag)
    }

    updateParameters() {
        let viewport = this.viewport
        let k = viewport.width / this.width
        this.k = k
        this.height = viewport.height / k
        this.vdx = 0.5 * viewport.width - this.x * k
        this.vdy = 0.5 * viewport.height - this.y * k
    }

    setZoom(zoom: number) {
        this.zoom = zoom
        this.width = this.viewport.width * (zk ** zoom)
        this.updateParameters()
    }

    setZoomXY(zoom: number, x: number, y: number) {
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
        this.oldZoom = this.zoom
        //this.defaultPosition = new Sprite(undefined, undefined, this.x, this.y, this.width, this.height)
    }

    restorePosition() {
        let defaultPosition = this.defaultPosition
        this.x = defaultPosition.x
        this.y = defaultPosition.y
        this.width = defaultPosition.width
        this.height = defaultPosition.height
        this.zoom = this.oldZoom
        this.updateParameters()
    }

    drawDefaultCamera() {
        let pos = this.defaultPosition
        ctx.fillStyle = "blue"
        ctx.strokeRect(xToScreen(pos.left), yToScreen(pos.top), distToScreen(pos.width), distToScreen(pos.height))
        ctx.fillStyle = "white"
    }

    toggle() {
        this.active = !this.active
    }
}

export function xToScreen(fieldX: number) {
    return fieldX * currentCanvas.k + currentCanvas.vdx
}
export function yToScreen(fieldY: number) {
   return fieldY * currentCanvas.k + currentCanvas.vdy
}
export function distToScreen(fieldDist: number) {
    return fieldDist * currentCanvas.k
}

export function xFromScreen(screenX: number) {
    return (screenX - currentCanvas.vdx) / currentCanvas.k
}
export function yFromScreen(screenY: number) {
    return (screenY - currentCanvas.vdy) / currentCanvas.k
}

export function distFromScreen(screenDist: number) {
    return screenDist / currentCanvas.k
}