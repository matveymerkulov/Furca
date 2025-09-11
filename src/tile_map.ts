import {Box} from "./box.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {arrayToString} from "./save_load.js"
import {showCollisionShapes} from "./input.js"
import {tileMap} from "./project.js"
import {floor} from "./functions.js"
import {collisionShape, collisionSprite} from "./system.js"
import {TileSet} from "./tile_set.js";
import {Point} from "./point.js";
import {Sprite} from "./sprite.js";
import {VectorSprite} from "./vector_sprite.js";
import {AngularSprite} from "./angular_sprite.js";
import {ShapeType} from "./vector_shape.js";
import {Layer} from "./layer.js";

export const emptyTile = -1

export let showBorder = false
export function setBorderVisibility(value: boolean) {
    showBorder = value
}

type TileByIndexExtractingProcessor = (tileMap: TileMap, index: number) => Sprite
type TileByPosExtractingProcessor = (tileMap: TileMap, x: number, y: number) => Sprite
type TileByIndexProcessor = (index: number, tileNum: number) => void
type TileByPosProcessor = (x: number, y: number, tileNum: number) => void
type SpriteAndTileCollisionProcessor = (collisionSprite: Sprite, tileNum: number, x: number, y: number) => void

export class TileMap extends Box {
    private _tileSet: TileSet
    private _columns: number
    private _rows: number
    private _array: number[]
    public cellWidth: number
    public cellHeight: number

    constructor(tileSet: TileSet, columns: number, rows: number, x = 0, y = 0
                , cellWidth = 1, cellHeight = 1, array: number[] = undefined) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this._tileSet = tileSet
        this._columns = columns
        this._rows = rows
        this._array = array ?? new Array(columns * rows).fill(emptyTile)
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
    }

    copy(dx = 0, dy = 0) {
        return new TileMap(this._tileSet, this._columns, this._rows, this.x + dx, this.y + dy
            , this.cellWidth, this.cellHeight, [...this._array])
    }

    toString() {
        return `new TileMap(tileSet.${this._tileSet.name}, ${this._columns}, ${this._rows}, ${this.x}, ${this.y}`
            + `, ${this.cellWidth}, ${this.cellHeight}, ${arrayToString(this._array, this._columns, 3)})`
    }

    get rows() {
        return this._rows
    }

    get columns() {
        return this._columns
    }

    get quantity() {
        return this._array.length
    }

    get tileSet() {
        return this._tileSet
    }

    get arrayCopy() {
        return [...this._array]
    }

    get name() {
        for(let [key, map] of Object.entries(tileMap)) {
            if(this === map) return key
        }
        return undefined 
    }

    image(num: number) {
        return this._tileSet.image(num)
    }

    tileColumnByPoint(point: Point) {
        return floor((point.x - this.left) / this.cellWidth)
    }

    tileRowByPoint(point: Point) {
        return floor((point.y - this.top) / this.cellHeight)
    }

    tileColumnByX(x: number) {
        return floor((x - this.left) / this.cellWidth)
    }

    tileRowByY(y: number) {
        return floor((y - this.top) / this.cellHeight)
    }

    tileByIndex(index: number) {
        return this._array[index]
    }

    tileByCoords(x: number, y: number) {
        const column = this.tileColumnByX(x)
        if(column < 0 || column >= this.columns) return emptyTile
        const row = this.tileRowByY(y)
        if(row < 0 || row >= this.rows) return emptyTile
        return this.tileByPos(column, row)
    }

    tileByPoint(point: { x: number; y: number }) {
        return this.tileByCoords(point.x, point.y)
    }

    tileIndexForPos(column: number, row: number) {
        return column + row * this._columns
    }

    tileColumnByIndex(index: number) {
        return index % this._columns
    }

    tileRowByIndex(index: number) {
        return Math.floor(index / this._columns)
    }

    tileXByColumn(column: number) {
        return this.left + this.cellWidth * (0.5 + column)
    }

    tileYByRow(row) {
        return this.top + this.cellHeight * (0.5 + row)
    }

    tileXByIndex(index: number) {
        return this.left + this.cellWidth * (0.5 + this.tileColumnByIndex(index))
    }

    tileYByIndex(index: number) {
        return this.top + this.cellHeight * (0.5 + this.tileRowByIndex(index))
    }

    tileByPos(column: number, row: number) {
        if(column < 0 || column >= this.columns || row < 0 || row >= this.rows) {
            return emptyTile
        }
        return this.tileByIndex(this.tileIndexForPos(column, row))
    }

    setTileByIndex(index: number, tileNum: number) {
        this._array[index] = tileNum
    }

    setTileByPos(column: number, row: number, tileNum: number) {
        this.setTileByIndex(this.tileIndexForPos(column, row), tileNum)
    }

    setTileByCoords(x: number, y: number, tile: number) {
        this.setTileByPos(this.tileColumnByX(x), this.tileRowByY(y), tile)
    }

    setArray(array: number[]) {
        if(array.length !== this._array.length) throw Error("Array size is not equal to tile map size")
        this._array = array
    }

    clear() {
        this._array.fill(-1)
    }

    draw() {
        const x0 = Math.floor(xToScreen(this.left))
        const y0 = Math.floor(yToScreen(this.top))
        const tileSet = this.tileSet

        if(showBorder) {
            ctx.strokeStyle = "white"
            ctx.strokeRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))
        }

        const width = distToScreen(this.cellWidth)
        const height = distToScreen(this.cellHeight)
        const quantity = this.quantity

        for(let row = 0; row < this._rows; row++) {
            let intY = Math.floor(y0 + height * row)
            let intHeight = Math.floor(y0 + height * (row + 1)) - intY
            for(let column = 0; column < this._columns; column++) {
                const tileNum = this.tileByPos(column, row)
                if(tileNum < 0 || tileNum >= quantity) continue
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

    drawTile(tileNum: number, column: number, row: number, intX: number, intY: number, intWidth: number, intHeight: number) {
        this.tileSet.images.image(tileNum).drawResized(intX, intY, intWidth, intHeight)
    }


    countTiles(tile: number) {
        let quantity = 0
        for(let index = 0; index < this.quantity; index++) {
            if(tile === this.tileByIndex(index)) quantity++
        }
        return quantity
    }

    findTileIndex(tile: string | number) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile === this.tileByIndex(index)) return index
        }
        throw new Error("Cannot find tile " + tile)
    }

    initTileSpriteByIndex(sprite: Sprite, index: number) {
        sprite.image = this.image(this.tileByIndex(index))
        sprite.x = this.tileXByIndex(index)
        sprite.y = this.tileYByIndex(index)
        sprite.width = this.cellWidth
        sprite.height = this.cellHeight
        return sprite
    }

    initTileSpriteByPos(sprite: Sprite, column: number, row: number) {
        this.initTileSpriteByIndex(sprite, this.tileIndexForPos(column, row))
    }

    extractTile(sprite: Sprite, tile: number) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            this.initTileSpriteByIndex(sprite, index)
            this.setTileByIndex(index, emptyTile)
            return sprite
        }
        throw new Error("Cannot find tile " + tile)
    }

    extractTilesByIndex(tile: number, code: TileByIndexExtractingProcessor) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            let sprite = code(this, index)
            this.initTileSpriteByIndex(sprite, index)
            this.setTileByIndex(index, emptyTile)
        }
    }

    extractTilesByPos(tile: number, code: TileByPosExtractingProcessor) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                if(tile !== this.tileByPos(column, row)) continue
                let sprite = code(this, column, row)
                this.initTileSpriteByPos(sprite, column, row)
                this.setTileByPos(column, row, emptyTile)
            }
        }
    }

    extractTileByIndex(sprite: Sprite, index: number) {
        this.initTileSpriteByIndex(sprite, index)
        this.setTileByIndex(index, emptyTile)
        return sprite
    }

    extractTileByPos(sprite: Sprite, column: number, row: number) {
        return this.extractTileByIndex(sprite, this.tileIndexForPos(column, row))
    }

    tileAngularSpriteByIndex(shapeType: ShapeType, index: number) {
        return new AngularSprite(this.image(this.tileByIndex(index)), this.tileXByIndex(index), this.tileYByIndex(index)
            , this.cellWidth, this.cellHeight, shapeType)
    }

    tileVectorSpriteByIndex(shapeType: ShapeType, index: number) {
        return new VectorSprite(this.image(this.tileByIndex(index)), this.tileXByIndex(index), this.tileYByIndex(index)
            , this.cellWidth, this.cellHeight, shapeType)
    }

    tileAngularSpriteByPos(shapeType: ShapeType, column: number, row: number) {
        return this.tileAngularSpriteByIndex(shapeType, this.tileIndexForPos(column, row))
    }

    tileVectorSpriteByPos(shapeType: ShapeType, column: number, row: number) {
        return this.tileVectorSpriteByIndex(shapeType, this.tileIndexForPos(column, row))
    }

    extractAngularTile(tile: string | number, shapeType: ShapeType) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            return this.extractAngularTileByIndex(index, shapeType)
        }
        throw new Error("Cannot find tile " + tile)
    }

    extractVectorTile(tile: string | number, shapeType: ShapeType) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            return this.extractVectorTileByIndex(index, shapeType)
        }
        throw new Error("Cannot find tile " + tile)
    }

    extractAngularTiles(tile: number, shapeType: ShapeType, layer: Layer) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            layer.add(this.extractAngularTileByIndex(index, shapeType))
        }
    }

    extractVectorTiles(tile: number, shapeType: ShapeType, layer: Layer) {
        for(let index = 0; index < this.quantity; index++) {
            if(tile !== this.tileByIndex(index)) continue
            layer.add(this.extractVectorTileByIndex(index, shapeType))
        }
    }

    extractAngularTileByIndex(index: number, shapeType: ShapeType) {
        let sprite = this.tileAngularSpriteByIndex(shapeType, index)
        this.setTileByIndex(index, emptyTile)
        return sprite
    }

    extractVectorTileByIndex(index: number, shapeType: ShapeType) {
        let sprite = this.tileVectorSpriteByIndex(shapeType, index)
        this.setTileByIndex(index, emptyTile)
        return sprite
    }

    extractAngularTileByPos(column: number, row: number, shapeType: any) {
        return this.extractAngularTileByIndex(this.tileIndexForPos(column, row), shapeType)
    }

    extractVectorTileByPos(column: number, row: number, shapeType: ShapeType) {
        return this.extractVectorTileByIndex(this.tileIndexForPos(column, row), shapeType)
    }

    shiftTiles(d: number) {
        for(let index = 0; index < this.quantity; index++) {
            if(this._array[index] === emptyTile) continue
            this._array[index] += d
        }
    }

    processTilesByPos(code: TileByPosProcessor) {
        for(let row = 0; row < this.rows; row++) {
            for(let column = 0; column < this.columns; column++) {
                code(column, row, this.tileByPos(column, row))
            }
        }
    }

    processTilesByIndex(code: TileByIndexProcessor) {
        for(let index = 0; index < this._array.length; index++) {
            code(index, this.tileByIndex(index))
        }
    }

    pasteTo(toMap: TileMap, dColumn = 0, dRow = 0) {
        for(let row = 0; row < this.rows; row++) {
            const mapRow = row + dRow
            if(mapRow < 0 || mapRow >= toMap.rows) continue
            for(let column = 0; column < this.columns; column++) {
                const mapColumn = column + dColumn
                if(mapColumn < 0 || mapColumn >= toMap.columns) continue
                const tile = this.tileByPos(column, row)
                if(tile < 0) continue
                toMap.setTileByPos(mapColumn, mapRow, tile)
            }
        }
    }

    tileCollisionWithSprite(sprite: Sprite, code: SpriteAndTileCollisionProcessor) {
        let tileSet = this._tileSet
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
                code(collisionSprite, tileNum, x, y)
            }
        }
    }

    collidesWithTileMap(map: TileMap, dColumn: number, dRow: number) {
        for(let row = 0; row < map.rows; row++) {
            const thisRow = row + dRow
            if(thisRow < 0 || thisRow >= this.rows) continue
            for(let column = 0; column < map.columns; column++) {
                const thisColumn = column + dColumn
                if(thisColumn < 0 || thisColumn >= this.columns) continue
                if(map.tileByPos(column, row) >= 0 && this.tileByPos(thisColumn, thisRow) >= 0) return true
            }
        }
        return false
    }
}