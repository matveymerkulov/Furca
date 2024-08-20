import {Action} from "./actions/action.js"

export class Constraint extends Action {
    constructor(sprite, parent) {
        super()
        this.sprite = sprite
        this.parent = parent
        this.dAngle = sprite.angle - parent.angle

        let dx = sprite.x - parent.x
        let dy = sprite.y - parent.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
        this.dAngle2 = Math.atan2(dy, dx) - parent.angle
    }

    execute() {
        let parent = this.parent
        this.sprite.angle = parent.angle + this.dAngle
        let angle = parent.angle + this.dAngle2
        this.sprite.x = parent.x + this.distance * Math.cos(angle)
        this.sprite.y = parent.y + this.distance * Math.sin(angle)
    }
}