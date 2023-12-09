import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import Sprite from "./sprite.js"
import {showCollisionShapes} from "./system.js"
import Shape from "./shape.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)
let collisionSprite = new Sprite()

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
        let x0 = Math.floor(xToScreen(this.leftX))
        let y0 = Math.floor(yToScreen(this.topY))

        ctx.fillStyle = "black"
        ctx.fillRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        for(let row = 0; row < this.rows; row++) {
            let y = y0 + height * row
            for(let column = 0; column < this.columns; column++) {
                let tileNum = this.getTile(column, row)
                if(tileNum === 0) continue
                let x = x0 + width * column
                this.tiles._images[tileNum].drawResized(x, y, width, height)
                if(!showCollisionShapes) continue
                let shape = this.collision[tileNum]
                if(shape === undefined) continue
                collisionShape.drawResized(x + distToScreen(shape.centerX - shape.halfWidth)
                    , y + distToScreen(shape.centerY - shape.halfHeight)
                    , width * shape.width, height * shape.height, shape.shapeType)
            }
        }
    }

    getTileRow(tileNum) {
        return Math.floor(tileNum / this.columns)
    }

    getTileColumn(tileNum) {
        return tileNum % this.columns
    }

    getTileSprite(column, row, shapeType) {
        let x = this.leftX + this.cellWidth * (0.5 + column)
        let y = this.topY + this.cellHeight * (0.5 + row)
        let tileNum = this.getTile(column, row)
        return new Sprite(this.tiles._images[tileNum], x, y, this.cellWidth, this.cellHeight, shapeType)
    }

    extract(tileNumber, shapeType) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(tileNumber !== this.getTile(column, row)) continue
                return this.extractTile(column, row, shapeType)
            }
        }
    }

    extractTile(column, row, shapeType) {
        let sprite = this.getTileSprite(column, row, shapeType)
        this.setTile(column, row, 0)
        return sprite
    }

    processTiles(code) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                code.call(null, column, row, this.getTile(column, row))
            }
        }
    }

    tileForPoint(point) {
        let column = Math.floor((point.centerX - this.leftX) / this.cellWidth)
        if(column < 0 || column >= this.columns) return -1
        let row = Math.floor((point.centerY - this.topY) / this.cellHeight)
        if(row < 0 || row >= this.rows) return -1
        return column + row * this.columns
    }

    collisionWithSprite(sprite, code) {
        let x0 = Math.floor((sprite.leftX - this.leftX) / this.cellWidth)
        let x1 = Math.ceil((sprite.rightX - this.leftX) / this.cellWidth)
        let y0 = Math.floor((sprite.topY - this.topY) / this.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - this.topY) / this.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.getTile(x, y)
                let shape = this.collision[tileNum]
                if(shape === undefined) continue
                collisionSprite.shapeType = shape.shapeType
                collisionSprite.moveTo(this.leftX + (shape.centerX + x) * this.cellWidth
                    , this.topY + (shape.centerY + y) * this.cellHeight)
                collisionSprite.setSize(this.cellWidth * shape.width, this.cellHeight * shape.height)
                if(!sprite.collidesWithSprite(collisionSprite)) continue
                code.call(null, collisionSprite, tileNum, x, y)
            }
        }
    }
}