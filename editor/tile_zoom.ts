import {Action} from "../src/actions/action.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"
import {Key} from "../src/key.js";

export let tilesPerRow = 8

export default class TileZoom extends Action {
    constructor(public zoomIn: Key, public zoomOut: Key) {
        super()
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