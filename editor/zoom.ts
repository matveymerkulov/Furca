import {Action} from "../src/actions/action.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"
import {canvasMouse} from "../src/system.js"
import {Key} from "../src/key.js";

export default class Zoom extends Action {
    constructor(public zoomIn: Key, public zoomOut: Key) {
        super()
    }

    execute() {
        if (canvasUnderCursor !== currentCanvas) return

        let zoom = currentCanvas.zoom
        if (this.zoomIn.wasPressed) {
            zoom--
        } else if (this.zoomOut.wasPressed) {
            zoom++
        } else {
            return
        }

        currentCanvas.setZoomXY(zoom, canvasMouse.x, canvasMouse.y)
    }
}