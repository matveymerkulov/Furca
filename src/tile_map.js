import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import {showCollisionShapes} from "./system.js"
import Shape from "./shape.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)

export default class TileMap extends Box {
    constructor(columns, rows, x, y, cellWidth, cellHeight) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.columns = columns
        this.rows = rows
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.layers = []
    }

    draw() {
        let x0 = Math.floor(xToScreen(this.leftX))
        let y0 = Math.floor(yToScreen(this.topY))

        ctx.fillStyle = "black"
        ctx.fillRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        for(let layerNum = 0; layerNum < this.layers.length; layerNum++) {
            let layer = this.layers[layerNum]
            for(let row = 0; row < this.rows; row++) {
                let y = y0 + height * row
                for(let column = 0; column < this.columns; column++) {
                    let tileNum = layer.getTile(column, row)
                    //if(tileNum === 0) continue
                    let x = x0 + width * column
                    layer.tileSet.images.image(tileNum).drawResized(x, y, width, height)
                    if(!showCollisionShapes) continue
                    let shape = this.collision[tileNum]
                    if(shape === undefined) continue
                    collisionShape.drawResized(x + distToScreen(shape.centerX - shape.halfWidth)
                        , y + distToScreen(shape.centerY - shape.halfHeight)
                        , width * shape.width, height * shape.height, shape.shapeType)
                }
            }
        }
    }

    getTileRow(tileNum) {
        return Math.floor(tileNum / this.columns)
    }

    getTileColumn(tileNum) {
        return tileNum % this.columns
    }

    tileForPoint(point) {
        let column = Math.floor((point.centerX - this.leftX) / this.cellWidth)
        if(column < 0 || column >= this.columns) return -1
        let row = Math.floor((point.centerY - this.topY) / this.cellHeight)
        if(row < 0 || row >= this.rows) return -1
        return column + row * this.columns
    }
}