import {Sprite} from "./sprite.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {Box} from "./box.js"
import {Shape} from "./shape.js"
import {arrayToString} from "./save_load.js"
import {showCollisionShapes} from "./input.js"
import {tileMap} from "./project.js"
import {floor, inBounds} from "./functions.js"

let collisionShape, collisionSprite
export const emptyTile = -1

export function initTileMap() {
    collisionShape = new Shape("rgb(255, 0, 255)", 0.5)
    collisionSprite = new Sprite()
}

export class TileMap extends Box {
    #tileSet
    #columns
    #rows
    #array
    constructor(tileSet, columns, rows, x, y, cellWidth, cellHeight, array) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.#tileSet = tileSet
        this.#columns = columns
        this.#rows = rows
        this.#array = array ?? new Array(columns * rows).fill(emptyTile)
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
    }

    copy(dx = 0, dy = 0) {
        return new TileMap(this.#tileSet, this.#columns, this.#rows, this.x + dx, this.y + dy
            , this.cellWidth, this.cellHeight, [...this.#array])
    }

    toString() {
        return `new TileMap(tileSet.${this.#tileSet.name}, ${this.#columns}, ${this.#rows}, ${this.x}, ${this.y}`
            + `, ${this.cellWidth}, ${this.cellHeight}, ${arrayToString(this.#array, this.#columns, 3)})`
    }

    get rows() {
        return this.#rows
    }

    get columns() {
        return this.#columns
    }

    get quantity() {
        return this.#array.length
    }

    get tileSet() {
        return this.#tileSet
    }

    get arrayCopy() {
        return [...this.#array]
    }

    get name() {
        for(let [key, map] of Object.entries(tileMap)) {
            if(this === map) return key
        }
        return ""
    }

    image(num) {
        return this.#tileSet.image(num)
    }

    tileColumnByPoint(point) {
        return floor((point.x - this.left) / this.cellWidth)
    }

    tileRowByPoint(point) {
        return floor((point.y - this.top) / this.cellHeight)
    }

    tileColumnByX(x) {
        return floor((x - this.left) / this.cellWidth)
    }

    tileRowByY(y) {
        return floor((y - this.top) / this.cellHeight)
    }

    tileByIndex(index) {
        return this.#array[index]
    }

    tileByCoords(x, y) {
        const column = this.tileColumnByX(x)
        if(column < 0 || column >= this.columns) return emptyTile
        const row = this.tileRowByY(y)
        if(row < 0 || row >= this.rows) return emptyTile
        return this.tileByPos(column, row)
    }

    tileByPoint(point) {
        return this.tileByCoords(point.x, point.y)
    }

    tileIndexForPos(column, row) {
        return column + row * this.#columns
    }

    tileColumnByIndex(index) {
        return index % this.#columns
    }

    tileRowByIndex(index) {
        return Math.floor(index / this.#columns)
    }

    tileXByColumn(column) {
        return this.left + this.cellWidth * (0.5 + column)
    }

    tileYByRow(row) {
        return this.top + this.cellHeight * (0.5 + row)
    }

    tileXByIndex(index) {
        return this.left + this.cellWidth * (0.5 + this.tileColumnByIndex(index))
    }

    tileYByIndex(index) {
        return this.top + this.cellHeight * (0.5 + this.tileRowByIndex(index))
    }

    tileByPos(column, row) {
        if(!inBounds(column, 0, this.columns) || !inBounds(row, 0, this.rows)) {
            return -1
        }
        return this.tileByIndex(this.tileIndexForPos(column, row))
    }

    setTileByIndex(index, tileNum) {
        this.#array[index] = tileNum
    }

    setTileByPos(column, row, tileNum) {
        this.setTileByIndex(this.tileIndexForPos(column, row), tileNum)
    }

    setTileByCoords(x, y, tile) {
        this.setTileByPos(this.tileColumnByX(x), this.tileRowByY(y), tile)
    }

    setArray(array) {
        if(array.length !== this.#array.length) throw Error("Array size is not equal to tilemap size")
        this.#array = array
    }

    clear() {
        this.#array.fill(-1)
    }

    draw() {
        const x0 = Math.floor(xToScreen(this.left))
        const y0 = Math.floor(yToScreen(this.top))
        const tileSet = this.tileSet

        ctx.strokeStyle = "white"
        ctx.strokeRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        const width = distToScreen(this.cellWidth)
        const height = distToScreen(this.cellHeight)

        for(let row = 0; row < this.#rows; row++) {
            let intY = Math.floor(y0 + height * row)
            let intHeight = Math.floor(y0 + height * (row + 1)) - intY
            for(let column = 0; column < this.#columns; column++) {
                const tileNum = this.tileByPos(column, row)
                if(tileNum < 0) continue
                const intX = Math.floor(x0 + width * column)
                const intWidth = Math.floor(x0 + width * (column + 1)) - intX
                this.drawTile(tileNum, column, row, intX, intY, intWidth, intHeight)

                if(!showCollisionShapes) continue
                const shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionShape.drawResized(intX + distToScreen(shape.x - shape.halfWidth)
                    , intY + distToScreen(shape.y - shape.halfHeight)
                    , width * shape.width, height * shape.height, shape.shapeType)
            }
        }
    }

    drawTile(tileNum, column, row, intX, intY, intWidth, intHeight) {
        this.tileSet.images.image(tileNum).drawResized(intX, intY, intWidth, intHeight)
    }


    countTiles(tile) {
        let quantity = 0
        for(let index = 0; index < this.quantity; index++) {
            if(tile === this.tileByIndex(index)) quantity++
        }
        return quantity
    }

    findTileIndex(tile) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile === this.tileByIndex(index)) return index
        }
        throw new Error("Cannot find tile " + tile)
    }

    initTileSpriteByIndex(sprite, index) {
        sprite.image = this.image(this.tileByIndex(index))
        sprite.x = this.tileXByIndex(index)
        sprite.y = this.tileYByIndex(index)
        sprite.width = this.cellWidth
        sprite.height = this.cellHeight
        return sprite
    }

    initTileSpriteByPos(sprite, column, row) {
        this.initTileSpriteByIndex(sprite, this.tileIndexForPos(column, row))
    }

    extractTile(sprite, tile) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            this.initTileSpriteByIndex(sprite, index)
            this.setTileByIndex(index, emptyTile)
            return sprite
        }
        throw new Error("Cannot find tile " + tile)
    }

    extractTilesByIndex(tile, code) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            let sprite = code.call(undefined, this, index)
            this.initTileSpriteByIndex(sprite, index)
            this.setTileByIndex(index, emptyTile)
        }
    }

    extractTilesByPos(tile, code) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(tile !== this.tileByPos(column, row)) continue
                let sprite = code.call(undefined, this, column, row)
                this.initTileSpriteByPos(sprite, column, row)
                this.setTileByPos(column, row, emptyTile)
            }
        }
    }

    extractTileByIndex(sprite, index) {
        this.initTileSpriteByIndex(sprite, index)
        this.setTileByIndex(index, emptyTile)
        return sprite
    }

    extractTileByPos(sprite, column, row) {
        return this.extractTileByIndex(sprite, this.tileIndexForPos(column, row))
    }

    processTilesByPos(code) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                code.call(this, column, row, this.tileByPos(column, row))
            }
        }
    }

    processTilesByIndex(code) {
        for(let index = 0; index < this.#array.length; index++) {
            code.call(this, index, this.tileByIndex(index))
        }
    }

    collisionWithSprite(sprite, code) {
        let tileSet = this.#tileSet
        let x0 = Math.floor((sprite.left - this.left) / this.cellWidth)
        let x1 = Math.ceil((sprite.right - this.left) / this.cellWidth)
        let y0 = Math.floor((sprite.top - this.top) / this.cellHeight)
        let y1 = Math.ceil((sprite.bottom - this.top) / this.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.tileByPos(x, y)
                let shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionSprite.shapeType = shape.shapeType
                collisionSprite.setPosition(this.left + (shape.x + x) * this.cellWidth
                    , this.top + (shape.y + y) * this.cellHeight)
                collisionSprite.setSize(this.cellWidth * shape.width, this.cellHeight * shape.height)
                if(!sprite.collidesWithSprite(collisionSprite)) continue
                code.call(null, collisionSprite, tileNum, x, y)
            }
        }
    }
}