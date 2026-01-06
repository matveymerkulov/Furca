import {mouse} from "./system.js"
import {Box} from "./box.js"

export let graphics = new PIXI.Graphics()

export class Canvas extends PIXI.Container {
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

        }

        this.updateParameters()
    }

    static create(node, x, y, minWidth, minHeight) {
        const canvas = new Canvas(node, x, y, minWidth, minHeight)
        window.onresize = function() {
            canvas.viewport.x = 0.5 * node.offsetWidth
            canvas.viewport.y = 0.5 * node.offsetHeight
            canvas.viewport.shapeWidth = node.offsetWidth
            canvas.viewport.shapeHeight = node.offsetHeight
            node.width = node.offsetWidth
            node.height = node.offsetHeight
            canvas._k = Math.min( node.offsetWidth / minWidth, node.offsetHeight / minHeight)
            canvas.updateParameters()
        }
        window.onresize()
        return canvas
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
        this._vdx = this.viewport.shapeHalfWidth - this.x * this._k
        this._vdy = this.viewport.shapeHalfHeight - this.y * this._k
    }

    setZoom(zoom) {
        this.zoom = zoom
        this.shapeWidth = this.viewport.shapeWidth * (zk ** zoom)
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