import {removeFromArray} from "./system.js"
import {tileSet} from "./project.js"
import Region from "./region.js"
import {arrayToString, booleanArrayToString} from "../editor/save_load.js"

export const type = {
    block: 0,
    frame: 1,
}

export const visibility = {
    visible: 0,
    hidden: 1,
    block: 2,
}

export class Block extends Region {
    type
    constructor(x, y, width, height, type) {
        super(1, x, y, width, height)
        this.type = type
    }

    toString() {
        return `new Block(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.type})`
    }
}

export default class TileSet {
    #images
    #collision
    visibility
    blocks
    constructor(images, vis, blocks) {
        this.#images = images
        this.#collision = new Array(images.quantity)
        this.visibility = vis ? vis : new Array(images.quantity).fill(visibility.visible)
        this.blocks = blocks === undefined ? [] : blocks
    }

    toString() {
        return `new TileSet(${this.#images.toString()}, ${arrayToString(this.visibility, this.columns, 1)}`
            + `, ${arrayToString(this.blocks)})`
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
        let block = new Block(x, y, width, height, type)
        this.initBlock(block, visibility.block)
        this.blocks.push(block)
    }

    initBlock(block, vis) {
        for(let row = block.y; row <= block.y + block.height; row++) {
            for(let column = block.x; column <= block.x + block.width; column++) {
                this.visibility[column + row * this.columns] = vis
            }
        }
    }

    removeBlock(x, y) {
        for(let block of this.blocks) {
            if(block.collidesWithTile(x, y)) {
                this.initBlock(block, visibility.visible)
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