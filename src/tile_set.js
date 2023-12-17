import {arrayToString} from "./save_load.js"

export default class TileSet {
    #images
    #collision
    constructor(name, images) {
        this.name = name
        this.#images = images
        this.#collision = new Array(images.quantity)
    }

    export() {
        return `new TileSet(${this.name},${this.#images.toString()},${arrayToString(this.#collision)})`
    }

    get images() {
        return this.#images
    }

    image(num) {
        return this.#images.image(num)
    }

    collisionShape(num) {
        return this.#collision[num]
    }

    setCollision(sprite, from, to) {
        if(from instanceof Array) {
            for(let tileNum of from) {
                this.#collision[tileNum] = sprite
            }
            return
        }

        if(to === undefined) {
            to = this.#collision.length
        }

        for(let tileNum = from; tileNum <= to; tileNum++) {
            this.#collision[tileNum] = sprite
        }
    }
}