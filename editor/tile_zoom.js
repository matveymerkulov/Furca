import {Action} from "../src/actions/action.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"

export let tilesPerRow = 8

export default class TileZoom extends Action {
    constructor(zoomIn, zoomOut) {
        super()
        this.zoomIn = zoomIn
        this.zoomOut = zoomOut
    }

    execute() {
        if (canvasUnderCursor !== currentCanvas) return
        if (this.zoomIn.wasPressed && tilesPerRow > 1) {
            tilesPerRow--
        } else if (this.zoomOut.wasPressed) {
            tilesPerRow++
        }
    }
}

export function setTilesPerRow(value) {
    tilesPerRow = value
}