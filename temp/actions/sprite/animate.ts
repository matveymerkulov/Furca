import {apsk} from "../../system"
import {Action} from "../action"
import {Sprite} from "../../sprite";
import {ImageArray} from "../../image_array";

export class Animate extends Action {
    frame: number

    constructor(public sprite: Sprite, public images: ImageArray, public speed: number) {
        super()
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
}