export default class Region {
    x
    y
    width
    height

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.modify(x, y, width, height)
    }

    modify(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    collidesWithTile(x, y) {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height
    }
}