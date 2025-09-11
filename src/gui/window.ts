import {element} from "../system.js"
import {Canvas} from "../canvas.js"

export let currentWindow, windows = []

export class Win {
    #node
    #canvases = []

    constructor(name) {
        this.#node = element(name)
    }

    init() {}

    onClose() {}

    addCanvas(name, fwidth, fheight) {
        let canvas = Canvas.create(element(name) as HTMLCanvasElement, fwidth, fheight, false)
        this.#canvases.push(canvas)
        return canvas
    }

    renderNode() {
        for(let canvas of this.#canvases) {
            canvas.renderNode()
        }
    }

    updateNode() {
        this.update()
        for(let canvas of this.#canvases) {
            canvas.updateNode()
        }
    }

    update() {
    }

    open() {
        //hideWindow()
        this.init()
        this.#node.style.visibility = "visible"
        if(currentWindow !== undefined) windows.push(currentWindow)
        currentWindow = this
    }

    close() {
        this.onClose()
        this.#node.style.visibility = "hidden"
        if(windows.length > 0) {
            currentWindow = windows.pop()
        } else {
            currentWindow = undefined
        }
    }
}

export function hideWindow() {
    if(currentWindow === undefined) return
    currentWindow.close()
}