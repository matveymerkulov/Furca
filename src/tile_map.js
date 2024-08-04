import Sprite from "./sprite.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import Shape from "./shape.js"
import {arrayToString} from "./save_load.js"
import {showCollisionShapes} from "./input.js"
import {tileMap} from "./project.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)
let collisionSprite = new Sprite()
export const emptyTile = -1

export default class TileMap extends Box {
    #tileSet
    #columns
    #rows
    #array
    operation
    constructor(tileSet, columns, rows, x, y, cellWidth, cellHeight, array, operation) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.#tileSet = tileSet
        this.#columns = columns
        this.#rows = rows
        this.#array = array ?? new Array(columns * rows).fill(emptyTile)
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.operation = operation
    }

    copy() {
        return new TileMap(this.#tileSet, this.#columns, this.#rows, this.x + 1 + this.width, this.y
            , this.cellWidth, this.cellHeight, [...this.#array])
    }

    toString() {
        return `new TileMap(tileSet["${this.#tileSet.name}"], ${this.#columns}, ${this.#rows}, ${this.x}, ${this.y}`
            + `, ${this.cellWidth}, ${this.cellHeight}, ${arrayToString(this.#array, this.#columns, 3)})`
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
        if(column < 0 || column >= this.#columns) return emptyTile
        let row = Math.floor(this.fRow(point))
        if(row < 0 || row >= this.#rows) return emptyTile
        return column + row * this.#columns
    }

    tileColumn(index) {
        return index % this.#columns
    }

    tileRow(index) {
        return Math.floor(index / this.#columns)
    }

    image(num) {
        return this.#tileSet.image(num)
    }

    tileByIndex(index) {
        return this.#array[index]
    }

    tileByPos(column, row) {
        return this.#array[column + row * this.columns]
    }

    setTileByIndex(index, tileNum) {
        this.#array[index] = tileNum
    }

    setTileByPos(column, row, tileNum) {
        this.#array[column + row * this.columns] = tileNum
    }

    setArray(array) {
        if(array.length !== this.#array.length) throw Error("Array size is not equal to tilemap size")
        this.#array = array
    }

    draw() {
        let x0 = Math.floor(xToScreen(this.leftX))
        let y0 = Math.floor(yToScreen(this.topY))
        let tileSet = this.tileSet

        ctx.strokeStyle = "white"
        ctx.strokeRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        if(this.operation !== "") {
            ctx.globalCompositeOperation = this.operation
        }

        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)

        for(let row = 0; row < this.#rows; row++) {
            let intY = Math.floor(y0 + height * row)
            let intHeight = Math.floor(y0 + height * (row + 1)) - intY
            for(let column = 0; column < this.#columns; column++) {
                let tileNum = this.tileByPos(column, row)
                if(tileNum < 0) continue
                let intX = Math.floor(x0 + width * column)
                let intWidth = Math.floor(x0 + width * (column + 1)) - intX
                this.drawTile(tileNum, intX, intY, intWidth, intHeight)

                if(!showCollisionShapes) continue
                let shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionShape.drawResized(intX + distToScreen(shape.x - shape.halfWidth)
                    , intY + distToScreen(shape.y - shape.halfHeight)
                    , width * shape.width, height * shape.height, shape.shapeType)
            }
        }

        ctx.globalCompositeOperation = "source-over"
    }

    drawTile(tileNum, intX, intY, intWidth, intHeight) {
        this.tileSet.images.image(tileNum).drawResized(intX, intY, intWidth, intHeight)
    }

    tileXByColumn(column) {
        return this.leftX + this.cellWidth * (0.5 + column)
    }

    tileYByRow(row) {
        return this.topY + this.cellHeight * (0.5 + row)
    }

    tileXByIndex(index) {
        return this.leftX + this.cellWidth * (0.5 + this.tileColumn(index))
    }

    tileYByIndex(row) {
        return this.topY + this.cellHeight * (0.5 + this.tileRow(row))
    }


    tileSpriteByIndex(shapeType, index) {
        return new Sprite(this.image(this.tileByIndex(index)), this.tileXByIndex(index), this.tileYByIndex(index)
            , this.cellWidth, this.cellHeight, shapeType)
    }

    tileSpriteByPos(shapeType, column, row) {
        return new Sprite(this.image(this.tileByPos(column, row)), this.tileXByColumn(column), this.tileYByRow(row)
            , this.cellWidth, this.cellHeight, shapeType)
    }

    extract(tileNumber, shapeType) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(tileNumber !== this.tileByPos(column, row)) continue
                return this.extractTileByPos(column, row, shapeType)
            }
        }
        throw new Error("Cannot find tile " + tileNumber)
    }

    extractTileByPos(column, row, shapeType) {
        let sprite = this.tileSpriteByPos(shapeType, column, row)
        this.setTileByPos(column, row, 0)
        return sprite
    }

    processTiles(code) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                code.call(null, column, row, this.tileByPos(column, row))
            }
        }
    }

    collisionWithSprite(sprite, code) {
        let tileSet = this.#tileSet
        let x0 = Math.floor((sprite.leftX - this.leftX) / this.cellWidth)
        let x1 = Math.ceil((sprite.rightX - this.leftX) / this.cellWidth)
        let y0 = Math.floor((sprite.topY - this.topY) / this.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - this.topY) / this.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.tileByPos(x, y)
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