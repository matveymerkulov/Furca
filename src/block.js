import Region from "./region.js"

export const type = {
    block: 0,
    frame: 1,
}

export class Block extends Region {
    type
    texture
    constructor(x, y, width, height, type, texture) {
        super(1, x, y, width + 1, height + 1)
        this.type = type
        this.texture = texture
    }

    toString() {
        return `new Block(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.type})`
    }
}