import {apsk} from "../../system.js"
import {Action} from "../action.js"

export default class Animate extends Action {
    constructor(sprite, images, speed) {
        super()
        this.sprite = sprite
        this.images = images
        this.speed = speed
        this.frame = 0.0
    }

    execute() {
        let quantity = this.images.quantity
        this.frame += apsk * this.speed
        while(this.frame < 0.0) {
            this.frame += quantity
        }
        while(this.frame > quantity) {
            this.frame -= quantity
        }
        this.sprite.image = this.images.image(Math.floor(this.frame))
    }

    copy(from) {
        return new Animate(from.sprite, from.images, this.speed)
    }
}