import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import Sprite from "./sprite.js"

export default class TileMap extends Box {
    constructor(tiles, columns, rows, x, y, cellWidth, cellHeight) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.columns = columns
        this.rows = rows
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.tiles = tiles
        this.array = new Array(columns * rows)
    }

    getTile(column, row) {
        return this.array[column + row * this.columns]
    }

    setTile(column, row, number) {
        this.array[column + row * this.columns] = number
    }

    draw() {
        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        for(let row = 0; row < this.rows; row++) {
            let y = Math.floor(yToScreen(this.topY)) + height * row
            for(let column = 0; column < this.columns; column++) {
                let x = Math.floor(xToScreen(this.leftX)) + width * column
                this.tiles._images[this.getTile(column, row)].drawResized(x, y, width, height)
            }
        }
    }

    extract(tileNumber) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(this.getTile(column, row) === tileNumber) {
                    let x = this.leftX + this.cellWidth * (0.5 + column)
                    let y = this.topY + this.cellHeight * (0.5 + row)
                    this.setTile(column, row, 0)
                    return new Sprite(this.tiles._images[tileNumber], x, y, this.cellWidth, this.cellHeight)
                }
            }
        }

    }
}