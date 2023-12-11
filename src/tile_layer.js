import Sprite from "./sprite.js"

let collisionSprite = new Sprite()

export default class TileLayer {
    #tileMap
    #array
    #tileSet
    constructor(tileMap, tileSet) {
        this.#tileMap = tileMap
        this.#array = new Array(this.#tileMap.columns * this.#tileMap.rows)
        this.#tileSet = tileSet
        tileMap.addLayer(this)
    }

    get rows() {
        return this.#tileMap.rows
    }

    get columns() {
        return this.#tileMap.columns
    }

    get tileMap() {
        return this.#tileMap
    }

    get tileSet() {
        return this.#tileSet
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

    tileSprite(column, row, shapeType) {
        let map = this.#tileMap, tileNum, x, y
        if(shapeType === undefined) {
            shapeType = row
            x = map.leftX + map.cellWidth * (0.5 + map.tileColumn(column))
            y = map.topY + map.cellHeight * (0.5 + map.tileRow(column))
            tileNum = this.tile(column)
        } else {
            x = map.leftX + map.cellWidth * (0.5 + column)
            y = map.topY + map.cellHeight * (0.5 + row)
            tileNum = this.tile(column, row)
        }
        return new Sprite(this.image(tileNum), x, y, map.cellWidth, map.cellHeight, shapeType)
    }

    extract(tileNumber, shapeType) {
        let map = this.#tileMap
        for(let row = 0; row < map.rows; row++) {
            for(let column = 0; column < map.columns; column++) {
                if(tileNumber !== this.tile(column, row)) continue
                return this.extractTile(column, row, shapeType)
            }
        }
        throw new Error("Cannot find tile " + tileNumber)
    }

    extractTile(column, row, shapeType) {
        if(shapeType === undefined) {
            let sprite = this.tileSprite(column, shapeType)
            this.setTile(column, 0)
            return sprite
        } else {
            let sprite = this.tileSprite(column, row, shapeType)
            this.setTile(column, row, 0)
            return sprite
        }
    }

    processTiles(code) {
        let map = this.#tileMap
        for(let row = 0; row < map.rows; row++) {
            for(let column = 0; column < map.columns; column++) {
                code.call(null, column, row, this.tile(column, row))
            }
        }
    }

    collisionWithSprite(sprite, code) {
        let map = this.#tileMap
        let tileSet = this.#tileSet
        let x0 = Math.floor((sprite.leftX - map.leftX) / map.cellWidth)
        let x1 = Math.ceil((sprite.rightX - map.leftX) / map.cellWidth)
        let y0 = Math.floor((sprite.topY - map.topY) / map.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - map.topY) / map.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.tile(x, y)
                let shape = tileSet.collisionShape(tileNum)
                if(shape === undefined) continue
                collisionSprite.shapeType = shape.shapeType
                collisionSprite.moveTo(map.leftX + (shape.centerX + x) * map.cellWidth
                    , map.topY + (shape.centerY + y) * map.cellHeight)
                collisionSprite.setSize(map.cellWidth * shape.width, map.cellHeight * shape.height)
                if(!sprite.collidesWithSprite(collisionSprite)) continue
                code.call(null, collisionSprite, tileNum, x, y)
            }
        }
    }
}