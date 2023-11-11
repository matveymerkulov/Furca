import {Action} from "./actions/action.js"

export default class Constraint extends Action {
    constructor(sprite, parent) {
        super()
        this.sprite = sprite
        this.parent = parent
        this.dAngle = sprite.angle - parent.angle

        let dx = sprite.centerX - parent.centerX
        let dy = sprite.centerY - parent.centerY
        this.distance = Math.sqrt(dx * dx + dy * dy)
        this.dAngle2 = Math.atan2(dy, dx) - parent.angle
    }

    execute() {
        let parent = this.parent
        this.sprite.angle = parent.angle + this.dAngle
        let angle = parent.angle + this.dAngle2
        this.sprite.centerX = parent.centerX + this.distance * Math.cos(angle)
        this.sprite.centerY = parent.centerY + this.distance * Math.sin(angle)
    }
}