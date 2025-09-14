import {Function} from "../function/function.js"

export class SpriteVariable extends Function {
    constructor() {
        super()
        this._id = name
        this.sprite = null
    }

    collisionWith(object, code) {
        this.sprite.collisionWith(object, code)
    }

    collisionWithSprite(sprite, code) {
        this.sprite.collisionWithSprite(sprite, code)
    }

    toSprite() {
        return this.sprite
    }
}

export let current = new SpriteVariable("current")