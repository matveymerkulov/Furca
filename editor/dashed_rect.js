import {Renderable} from "../src/renderable.js"

export default class DashedRect extends Renderable {
    draw() {
        if(this.object !== undefined) this.object.drawDashedRect()
    }
}