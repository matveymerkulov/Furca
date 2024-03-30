 export default class Region {
    x
    y
    width
    height
    columns

    constructor(columns, x = 0, y = 0, width = 1, height = 1) {
        this.modify(columns, x, y, width, height)
    }

    modify(columns, x, y, width, height) {
        this.columns = columns
        this.x = width > 0 ? x : x + width
        this.y = height > 0 ? y : y + height
        this.width = Math.abs(width)
        this.height = Math.abs(height)
    }

    process(code) {
        for(let y = 0; y <= this.height; y++) {
            for(let x = 0; x <= this.width; x++) {
                code.call(this, x + this.x + (y + this.y) * this.columns)
            }
        }
    }

    collidesWithTile(x, y) {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height
    }
}