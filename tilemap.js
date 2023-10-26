import Area from "./area.js"
import {distToScreen, xToScreen} from "./canvas.js"

export default class TileMap extends Area {
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
            let y = xToScreen(this.topY + this.cellHeight * row)
            for(let column = 0; column < this.columns; column++) {
                let x = xToScreen(this.leftX + this.cellWidth * column)
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