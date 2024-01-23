import {removeFromArray} from "./system.js"

class Block {
    #x
    #y
    #width
    #height

    constructor(x, y, width, height) {
        this.#x = x
        this.#y = y
        this.#width = width
        this.#height = height
    }

    collidesWithTile(x, y) {
        return x >= this.#x && x < this.#x + this.#width && y >= this.#y && y < this.#y + this.#height
    }
}

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

    addBlock(x, y, width, height) {
        this.#blocks.push(new Block(x, y, width, height))
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