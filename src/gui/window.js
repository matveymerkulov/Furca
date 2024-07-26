import {element} from "../system.js"
import Canvas from "../canvas.js"

export let currentWindow, windows = []

export class Win {
    #node
    #canvases = []

    constructor(name) {
        this.#node = element(name)
    }

    addCanvas(name, fwidth, fheight) {
        let canvas = Canvas.create(element(name), fwidth, fheight)
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

    show() {
        hideWindow()
        this.#node.style.visibility = "visible"
    }

    hide() {
        this.#node.style.visibility = "hidden"
        if(currentWindow === this) currentWindow = undefined
    }
}

export function hideWindow() {
    if(currentWindow === undefined) return
    currentWindow.hide()
    currentWindow = undefined
}