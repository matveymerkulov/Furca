import Sprite from "./sprite.js"

let collisionSprite = new Sprite()

export default class TileLayer {
    constructor(tileMap, tileSet) {
        this.tileMap = tileMap
        this.array = new Array(tileMap.columns * tileMap.rows)
        this.tileSet = tileSet
        tileMap.layers.push(this)
    }

    getTile(column, row) {
        return this.array[column + row * this.tileMap.columns]
    }

    setTile(column, row, number) {
        this.array[column + row * this.tileMap.columns] = number
    }

    getTileSprite(column, row, shapeType) {
        let map = this.tileMap
        let x = map.leftX + map.cellWidth * (0.5 + column)
        let y = map.topY + map.cellHeight * (0.5 + row)
        let tileNum = this.getTile(column, row)
        return new Sprite(this.tileSet.images.image(tileNum), x, y, map.cellWidth, map.cellHeight, shapeType)
    }

    extract(tileNumber, shapeType) {
        let map = this.tileMap
        for(let row = 0; row < map.rows; row++) {
            for(let column = 0; column < map.columns; column++) {
                if(tileNumber !== this.getTile(column, row)) continue
                return this.extractTile(column, row, shapeType)
            }
        }
        throw new Error("Cannot find tile " + tileNumber)
    }

    extractTile(column, row, shapeType) {
        let sprite = this.getTileSprite(column, row, shapeType)
        this.setTile(column, row, 0)
        return sprite
    }

    processTiles(code) {
        let map = this.tileMap
        for(let row = 0; row < map.rows; row++) {
            for(let column = 0; column < map.columns; column++) {
                code.call(null, column, row, this.getTile(column, row))
            }
        }
    }

    collisionWithSprite(sprite, code) {
        let map = this.tileMap
        let tileSet = this.tileSet
        let x0 = Math.floor((sprite.leftX - map.leftX) / map.cellWidth)
        let x1 = Math.ceil((sprite.rightX - map.leftX) / map.cellWidth)
        let y0 = Math.floor((sprite.topY - map.topY) / map.cellHeight)
        let y1 = Math.ceil((sprite.bottomY - map.topY) / map.cellHeight)
        for(let y = y0; y <= y1; y++) {
            for(let x = x0; x <= x1; x++) {
                let tileNum = this.getTile(x, y)
                let shape = tileSet.collision[tileNum]
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