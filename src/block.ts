import {Region} from "./region.js"

export enum BlockType {
    block,
    frame,
}

export class Block extends Region {
    texture: HTMLImageElement

    constructor(x: number = 0, y: number = 0, width: number = 1, height: number = 1, public type: BlockType = BlockType.block) {
        super(1, x, y, width, height)
    }

    toString() {
        return `new Block(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.type})`
    }
}