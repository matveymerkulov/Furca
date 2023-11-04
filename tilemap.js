import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import Sprite from "./sprite.js"
import {showCollisionShapes} from "./system.js"
import Shape from "./shape.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)

export default class TileMap extends Box {
    constructor(tiles, columns, rows, x, y, cellWidth, cellHeight) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.columns = columns
        this.rows = rows
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.tiles = tiles
        this.array = new Array(columns * rows)
        this.collision = new Array(tiles._images.length)
    }

    getTile(column, row) {
        return this.array[column + row * this.columns]
    }

    setTile(column, row, number) {
        this.array[column + row * this.columns] = number
    }

    setCollision(sprite, from, to) {
        if(from instanceof Array) {
            for(let tileNum of from) {
                this.collision[tileNum] = sprite
            }
            return
        }

        if(to === undefined) {
            to = this.collision.length
        }

        for(let tileNum = from; tileNum <= to; tileNum++) {
            this.collision[tileNum] = sprite
        }
    }

    draw() {
        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        for(let row = 0; row < this.rows; row++) {
            let y = Math.floor(yToScreen(this.topY)) + height * row
            for(let column = 0; column < this.columns; column++) {
                let x = Math.floor(xToScreen(this.leftX)) + width * column
                let tileNum = this.getTile(column, row)
                this.tiles._images[tileNum].drawResized(x, y, width, height)
                if(showCollisionShapes) {
                    let shape = this.collision[tileNum]
                    if(shape !== undefined) {
                        collisionShape.drawResized(x, y, width, height, shape.shapeType)
                    }
                }
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

    collisionWithSprite(sprite, code) {
        let x0 = Math.floor((sprite.leftX - this.leftX) / this.cellWidth)
        let x1 = Math.ceil((sprite.rightX - this.leftX) / this.cellWidth)
        let y0 = Math.floor((sprite.topY - this.topY) / this.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - this.topY) / this.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let shape = this.collision[this.getTile(x, y)]
                if(shape === undefined) continue
                shape.moveTo(this.leftX + (0.5 + x) * this.cellWidth, this.topY + (0.5 + y) * this.cellHeight)
                shape.setSize(this.cellWidth, this.cellHeight)
                if(sprite.collidesWithSprite(shape)) {
                    code.call(null, shape)
                }
            }
        }
    }
}