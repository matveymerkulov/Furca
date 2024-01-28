import {removeFromArray} from "./system.js"
import {tileSet} from "./project.js"

export default class TileSet {
    #images
    #collision
    #blocks
    constructor(images) {
        this.#images = images
        this.#collision = new Array(images.quantity)
        this.#blocks = []
    }

    toString() {
        return `new TileSet(${this.#images.toString()})`
    }

    get images() {
        return this.#images
    }

    get name() {
        for(let [key, set] of Object.entries(tileSet)) {
            if(this === set) return key
        }
        return ""
    }

    addBlock(x, y, width, height) {
        this.#blocks.push(new Region(x, y, width, height))
    }

    removeBlock(x, y) {
        for(let block of this.#blocks) {
            if(block.collidesWithTile(x, y)) {
                removeFromArray(block, this.#blocks)
                return
            }
        }
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