import {Region} from "./region.js"

export class Block extends Region {
    static blockType = {
        block: 0,
        frame: 1,
    }

    type
    texture
    constructor(x, y, width, height, type, texture) {
        super(1, x, y, width, height)
        this.type = type
        this.texture = texture
    }

    toString() {
        return `new Block(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.type})`
    }
}