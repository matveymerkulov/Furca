import {Action} from "../src/actions/action.js"
import {project} from "../src/index.js"
import {screenMouse} from "../src/system.js"
import {distFromScreen} from "../src/canvas.js"

export default class MouseMove extends Action {
    constructor(object, key, k = 1, rect = true) {
        super()
        this.object = object
        this.key = key
        this.k = k
        this.rect = rect
    }

    execute() {
        if(this.object === undefined) return
        if(this.rect) this.object.drawDashedRect()
        if(this.key.wasPressed) {
            this.mouseX0 = screenMouse.centerX
            this.mouseY0 = screenMouse.centerY
            this.objectX0 = this.object.centerX
            this.objectY0 = this.object.centerY
        } else if(this.key.isDown) {
            this.object.centerX = this.objectX0 + this.k * distFromScreen(screenMouse.centerX - this.mouseX0)
            this.object.centerY = this.objectY0 + this.k * distFromScreen(screenMouse.centerY - this.mouseY0)
        }
    }
}