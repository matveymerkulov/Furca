import {removeFromArray} from "./system.js"
import {tileSet} from "./project.js"
import {arrayToString} from "../editor/save_load.js"
import {getTexturePart} from "./texture.js"
import {Block} from "./block.js"

export const visibility = {
    visible: 0,
    hidden: 1,
    block: 2,
}

export default class TileSet {
    #images
    #collision
    visibility
    blocks
    categories
    altTile
    groups

    constructor(images, vis, blocks = [], categories = [], altTile = -1, groups = []) {
        this.#images = images
        this.#collision = new Array(images.quantity)
        this.visibility = vis ? vis : new Array(images.quantity).fill(visibility.visible)
        this.blocks = blocks
        this.categories = categories
        this.altTile = altTile
        this.groups = groups
    }

    toString() {
        return `new TileSet(${this.#images.toString()}, ${arrayToString(this.visibility, this.columns, 1)}`
            + `, ${arrayToString(this.blocks, 2)}, ${arrayToString(this.categories, 1)}`
            + `, ${this.altTile}, ${arrayToString(this.groups)})`
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

    image(num) {
        return this.#images.image(num)
    }

    get columns() {
        return this.#images.columns
    }

    get rows() {
        return this.#images.rows
    }

    addRegion(region, type) {
        this.addBlock(region.x, region.y, region.width + 1, region.height + 1, type)
    }

    addBlock(x, y, width, height, type) {
        let block = new Block(x, y, width, height, type)
        this.setBlockVisibility(block, visibility.block)
        this.initBlockImage(block)
        this.blocks.push(block)
    }

    initBlockImage(block) {
        let size = this.images.width
        block.texture = getTexturePart(this.images.texture, block.x * size, block.y * size
            , block.width * size, block.height * size)
    }

    setBlockVisibility(block, vis) {
        for(let row = block.y; row < block.y + block.height; row++) {
            for(let column = block.x; column < block.x + block.width; column++) {
                this.visibility[column + row * this.columns] = vis
            }
        }
    }

    removeBlock(x, y) {
        for(let block of this.blocks) {
            if(block.collidesWithTile(x, y)) {
                this.setBlockVisibility(block, visibility.visible)
                removeFromArray(block, this.blocks)
                return
            }
        }
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