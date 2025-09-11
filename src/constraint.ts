import {Action} from "./actions/action.js"
import {Sprite} from "./sprite.js";
import {atan2, cos, sin, sqrt} from "./functions.js";

export class Constraint extends Action {
    distance: number;
    private readonly dAngle: number
    private readonly dAngle2: number;

    constructor(public sprite: Sprite, public parent: Sprite) {
        super()
        this.dAngle = sprite.angle - parent.angle
        let dx = sprite.x - parent.x
        let dy = sprite.y - parent.y
        this.distance = sqrt(dx * dx + dy * dy)
        this.dAngle2 = atan2(dy, dx) - parent.angle
    }

    execute() {
        let parent = this.parent
        this.sprite.angle = parent.angle + this.dAngle
        let angle = parent.angle + this.dAngle2
        this.sprite.x = parent.x + this.distance * cos(angle)
        this.sprite.y = parent.y + this.distance * sin(angle)
    }
}