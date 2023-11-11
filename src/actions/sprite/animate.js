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
        let images = this.images._images
        this.frame += apsk * this.speed
        while(this.frame < 0.0) {
            this.frame += images.length
        }
        while(this.frame > images.length) {
            this.frame -= images.length
        }
        this.sprite.image = images[Math.floor(this.frame)]
    }

    copy(from) {
        return new Animate(from.sprite, from.images, this.speed)
    }
}