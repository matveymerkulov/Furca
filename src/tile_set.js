import {removeFromArray} from "./system.js"
import {tileSet} from "./project.js"
import Region from "./region.js"
import {arrayToString, booleanArrayToString} from "../editor/save_load.js"

export const type = {
    block: Symbol("block"),
    frame: Symbol("frame"),
}

export const visibility = {
    visible: 0,
    hidden: 1,
    block: 2,
}

class Block extends Region {
    type
    constructor(x, y, width, height, type) {
        super(1, x, y, width, height)
        this.type = type
    }
}

export default class TileSet {
    #images
    #collision
    visibility
    blocks
    constructor(images, vis) {
        this.#images = images
        this.#collision = new Array(images.quantity)
        this.visibility = vis ? vis : new Array(images.quantity).fill(visibility.visible)
        this.blocks = []
    }

    toString() {
        return `new TileSet(${this.#images.toString()}, getIntArray(${arrayToString(this.visibility)}))`
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

    addRegion(region, type) {
        this.addBlock(region.x, region.y, region.width, region.height, type)
    }

    addBlock(x, y, width, height, type) {
        this.initBlock(x, y, width, height, visibility.block)
        this.blocks.push(new Block(x, y, width, height, type))
    }

    initBlock(x, y, width, height, vis) {
        for(let row = y; row <= y + height; row++) {
            for(let column = x; column <= x + width; column++) {
                this.visibility[column + row * this.columns] = vis
            }
        }
    }

    removeBlock(x, y) {
        for(let block of this.blocks) {
            if(block.collidesWithTile(x, y)) {
                removeFromArray(block, this.blocks)
                return
            }
        }
    }

    image(num) {
        return this.#images.image(num)
    }

    get columns() {
        return this.#images.columns
    }

    get rows() {
        return this.#images.rows
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