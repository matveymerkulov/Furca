import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import Shape from "./shape.js"
import Sprite from "./sprite.js"
import {arrayToString} from "../editor/save_load.js"
import {showCollisionShapes} from "./input.js"
import {tileMap} from "./project.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)
let collisionSprite = new Sprite()

export default class TileMap extends Box {
    #tileSet
    #columns
    #rows
    #array
    emptyTile
    constructor(tileSet, columns, rows, x, y, cellWidth, cellHeight, array, emptyTile = -1) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.#tileSet = tileSet
        this.#columns = columns
        this.#rows = rows
        this.#array = array ?? new Array(columns * rows).fill(0)
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.emptyTile = emptyTile
    }

    copy() {
        return new TileMap(this.#tileSet, this.#columns, this.#rows, this.x + 1 + this.width, this.y
            , this.cellWidth, this.cellHeight, [...this.#array])
    }

    toString() {
        return `new TileMap(tileSet["${this.#tileSet.name}"], ${this.#columns}, ${this.#rows}, ${this.x}`
            + `, ${this.y}, ${this.cellWidth}, ${this.cellHeight}, ${arrayToString(this.#array, this.#columns, 3)}`
            + `, ${this.emptyTile})`
    }

    get rows() {
        return this.#rows
    }

    get columns() {
        return this.#columns
    }

    get tileSet() {
        return this.#tileSet
    }

    get name() {
        for(let [key, map] of Object.entries(tileMap)) {
            if(this === map) return key
        }
        return ""
    }

    fColumn(point) {
        return (point.x - this.leftX) / this.cellWidth
    }

    fRow(point) {
        return (point.y - this.topY) / this.cellHeight
    }

    tileForPoint(point) {
        let column = Math.floor(this.fColumn(point))
        if(column < 0 || column >= this.#columns) return -1
        let row = Math.floor(this.fRow(point))
        if(row < 0 || row >= this.#rows) return -1
        return column + row * this.#columns
    }

    tileColumn(tileNum) {
        return tileNum % this.#columns
    }

    tileRow(tileNum) {
        return Math.floor(tileNum / this.#columns)
    }

    image(num) {
        return this.#tileSet.image(num)
    }

    tile(column, row) {
        return this.#array[row === undefined ? column : column + row * this.columns]
    }

    setTile(column, row, number) {
        if(number === undefined) {
            this.#array[column] = row
        } else {
            this.#array[column + row * this.columns] = number
        }
    }

    setArray(array) {
        if(array.length !== this.#array.length) throw Error("Array size is not equal to tilemap size")
        this.#array = array
    }

    draw() {
        let x0 = Math.floor(xToScreen(this.leftX))
        let y0 = Math.floor(yToScreen(this.topY))

        ctx.strokeStyle = "white"
        ctx.strokeRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)

        let tileSet = this.tileSet
        let images = tileSet.images
        for(let row = 0; row < this.#rows; row++) {
            let y = y0 + height * row
            for(let column = 0; column < this.#columns; column++) {
                let tileNum = this.tile(column, row)
                if(tileNum === this.emptyTile) continue
                let x = x0 + width * column
                images.image(tileNum).drawResized(x, y, width, height)
                if(!showCollisionShapes) continue
                let shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionShape.drawResized(x + distToScreen(shape.x - shape.halfWidth)
                    , y + distToScreen(shape.y - shape.halfHeight)
                    , width * shape.width, height * shape.height, shape.shapeType)
            }
        }
    }

    tileSprite(shapeType, column, row) {
        let tileNum, x, y
        if(row === undefined) {
            x = this.leftX + this.cellWidth * (0.5 + this.tileColumn(column))
            y = this.topY + this.cellHeight * (0.5 + this.tileRow(column))
            tileNum = this.tile(column)
        } else {
            x = this.leftX + this.cellWidth * (0.5 + column)
            y = this.topY + this.cellHeight * (0.5 + row)
            tileNum = this.tile(column, row)
        }
        return new Sprite(this.image(tileNum), x, y, this.cellWidth, this.cellHeight, shapeType)
    }

    extract(tileNumber, shapeType) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(tileNumber !== this.tile(column, row)) continue
                return this.extractTile(column, row, shapeType)
            }
        }
        throw new Error("Cannot find tile " + tileNumber)
    }

    extractTile(column, row, shapeType) {
        if(shapeType === undefined) {
            let sprite = this.tileSprite(shapeType, column)
            this.setTile(column, 0)
            return sprite
        } else {
            let sprite = this.tileSprite(shapeType, column, row)
            this.setTile(column, row, 0)
            return sprite
        }
    }

    processTiles(code) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                code.call(null, column, row, this.tile(column, row))
            }
        }
    }

    transform(centerX = 0.5 * this.#columns, centerY = 0.5 * this.#rows, mirrorHorizontally, mirrorVertically, swap) {
        centerX -= 0.5
        centerY -= 0.5
        let newArray = new Array(this.#array.length).fill(0)
        let newK = swap ? this.#columns : this.#rows
        for(let y = 0; y < this.#rows; y++) {
            for(let x = 0; x < this.#columns; x++) {
                let newX = x - centerX
                let newY = y - centerY
                newX = mirrorHorizontally ? -newX : newX
                newY = mirrorVertically ? -newY : newY
                if(swap) [newX, newY] = [newY, newX]
                newX += centerX
                newY += centerY
                if(newX < 0 || newX >= this.#columns) continue
                if(newY < 0 || newY >= this.#rows) continue
                newArray[newX + newK * newY] = this.#array[x + this.#columns * y]
            }
        }
        //if(swap) [this.#columns, this.#rows] = [this.#rows, this.#columns]
        this.#array = newArray
    }

    turnClockwise(centerX, centerY) {
        this.transform(centerX, centerY, false, true, true)
    }

    turnCounterclockwise(centerX, centerY) {
        this.transform(centerX, centerY, true, false, true)
    }

    mirrorHorizontally(centerX, centerY) {
        this.transform(centerX, centerY, true, false, false)
    }

    mirrorVertically(centerX, centerY) {
        this.transform(centerX, centerY, false, true, false)
    }

    collisionWithSprite(sprite, code) {
        let tileSet = this.#tileSet
        let x0 = Math.floor((sprite.leftX - this.leftX) / this.cellWidth)
        let x1 = Math.ceil((sprite.rightX - this.leftX) / this.cellWidth)
        let y0 = Math.floor((sprite.topY - this.topY) / this.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - this.topY) / this.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.tile(x, y)
                let shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionSprite.shapeType = shape.shapeType
                collisionSprite.setPosition(this.leftX + (shape.x + x) * this.cellWidth
                    , this.topY + (shape.y + y) * this.cellHeight)
                collisionSprite.setSize(this.cellWidth * shape.width, this.cellHeight * shape.height)
                if(!sprite.collidesWithSprite(collisionSprite)) continue
                code.call(null, collisionSprite, tileNum, x, y)
            }
        }
    }
}