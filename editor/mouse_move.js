import {Action} from "../src/actions/action.js"
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
            this.mouseX0 = screenMouse.x
            this.mouseY0 = screenMouse.y
            this.objectX0 = this.object.x
            this.objectY0 = this.object.y
        } else if(this.key.isDown) {
            this.object.x = this.objectX0 + this.k * distFromScreen(screenMouse.x - this.mouseX0)
            this.object.y = this.objectY0 + this.k * distFromScreen(screenMouse.y - this.mouseY0)
        }
    }
}