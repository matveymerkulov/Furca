import {tileSet} from "./project.js"
import {arrayToString} from "./save_load.js"
import {getTexturePart} from "./texture.js"
import {Block, BlockType} from "./block.js"
import {removeFromArray} from "./functions.js"
import {ImageArray} from "./image_array.js";
import {Category} from "./auto_tiling.js";
import {Region} from "./region.js";
import {Sprite} from "./sprite.js";

export enum Visibility {
    visible,
    hidden,
    block,
}

export class TileSet {
    visibility: number[]
    collision: any[] = []

    constructor(images: ImageArray, visibility: number[] = undefined, public blocks: Block[] = []
                , public categories: Category[] = [], public altTile: number = -1, public groups: number[] = []) {
        this.images = images
        this.visibility = visibility ? visibility : [].fill(Visibility.visible, 0, images.quantity)
    }

    toString() {
        return `new TileSet(${this.images.toString()}, ${arrayToString(this.visibility, this.columns, 1)}`
            + `, ${arrayToString(this.blocks, 2)}, ${arrayToString(this.categories, 1)}`
            + `, ${this.altTile}, ${arrayToString(this.groups)})`
    }

    get name() {
        for(let [key, set] of Object.entries(tileSet)) {
            if(this === set) return key
        }
        return ""
    }

    get texture() {
        return this.images.texture
    }

    get images() {
        return this.images
    }

    set images(value) {
        this.images = value
    }

    image(num) {
        return this.images.image(num)
    }

    get columns() {
        return this.images.columns
    }

    get rows() {
        return this.images.rows
    }

    get quantity() {
        return this.images.quantity
    }

    tileNumByPos(column: number, row: number) {
        return column + row * this.columns
    }

    tileColumnByIndex(index: number) {
        return index % this.columns
    }

    tileRowByIndex(index: number) {
        return Math.floor(index / this.columns)
    }

    addRegion(region: Region, type) {
        this.addBlock(region.x, region.y, region.width + 1, region.height + 1, type)
    }

    addBlock(x: number, y: number, width: number, height: number, type: BlockType) {
        const block = new Block(x, y, width, height, type)
        this.setBlockVisibility(block, Visibility.block)
        this.initBlockImage(block)
        this.blocks.push(block)
    }

    initBlockImage(block: Block) {
        const size = this.images.width
        block.texture = getTexturePart(this.images.texture, block.x * size, block.y * size
            , block.width * size, block.height * size)
    }

    setBlockVisibility(block: Block, vis) {
        for(let row = block.y; row < block.y + block.height; row++) {
            for(let column = block.x; column < block.x + block.width; column++) {
                this.visibility[column + row * this.columns] = vis
            }
        }
    }

    removeBlock(x: number, y: number) {
        for(let block of this.blocks) {
            if(block.collidesWithTile(x, y)) {
                this.setBlockVisibility(block, Visibility.visible)
                removeFromArray(block, this.blocks)
                return
            }
        }
    }

    collisionShape(num: number) {
        return this.collision[num]
    }

    setCollision(sprite: Sprite, from: number = 0, to: number = undefined) {
        if(to === undefined) {
            to = this.collision.length
        }

        for(let tileNum = from; tileNum <= to; tileNum++) {
            this.collision[tileNum] = sprite
        }
    }

    setCollisionFromArray(sprite: Sprite, array: number[]) {
        for(let tileNum of array) {
            this.collision[tileNum] = sprite
        }
        return
    }
}