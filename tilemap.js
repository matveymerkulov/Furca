import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Shape from "./shape.js"

export default class TileMap extends Shape {
    constructor(tiles, columns, rows, x, y, cellWidth, cellHeight) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.columns = columns
        this.rows = rows
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.tiles = tiles
        this.map = new IntMap(columns, rows)
    }

    draw() {
        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        for(let row = 0; row < this.rows; row++) {
            let y = Math.floor(yToScreen(this.topY)) + height * row
            for(let column = 0; column < this.columns; column++) {
                let x = Math.floor(xToScreen(this.leftX)) + width * column
                this.tiles._images[this.map.getNum(column, row)].drawResized(x, y, width, height)
            }
        }
    }
}

class IntMap {
    constructor(columns, rows) {
        this.columns = columns
        this.rows = rows
        this.array = new Array(columns * rows)
    }

    getNum(column, row) {
        return this.array[column + row * this.columns]
    }
}