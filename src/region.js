export default class Region {
    x
    y
    width
    height
    columns

    constructor(columns, x = 0, y = 0, width = 0, height = 0) {
        this.modify(columns, x, y, width, height)
    }

    modify(columns, x, y, width, height) {
        this.columns = columns
        this.x = x
        this.y = y
        this.width = width
        this.height = height
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