import {ctx, distToScreen, xToScreen, yToScreen} from "./canvas.js"
import Box from "./box.js"
import {showCollisionShapes} from "./system.js"
import Shape from "./shape.js"

let collisionShape = new Shape("rgb(255, 0, 255)", 0.5)

export default class TileMap extends Box {
    #columns
    #rows
    #layers = []
    constructor(columns, rows, x, y, cellWidth, cellHeight) {
        super(x, y, cellWidth * columns, cellHeight * rows)
        this.#columns = columns
        this.#rows = rows
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
    }

    get rows() {
        return this.#rows
    }

    get columns() {
        return this.#columns
    }

    layer(num) {
        return this.#layers[num]
    }

    addLayer(layer) {
        if(layer.tileMap !== this) throw Error("Layer can't be added to tile map manually")
        this.#layers.push(layer)
    }

    draw() {
        let x0 = Math.floor(xToScreen(this.leftX))
        let y0 = Math.floor(yToScreen(this.topY))

        ctx.fillStyle = "black"
        ctx.fillRect(x0, y0, distToScreen(this.width), distToScreen((this.height)))

        let width = distToScreen(this.cellWidth)
        let height = distToScreen(this.cellHeight)
        this.#layers.forEach(layer => {
            let tileSet = layer.tileSet
            let images = tileSet.images
            for(let row = 0; row < this.#rows; row++) {
                let y = y0 + height * row
                for(let column = 0; column < this.#columns; column++) {
                    let tileNum = layer.tile(column, row)
                    //if(tileNum === 0) continue
                    let x = x0 + width * column
                    images.image(tileNum).drawResized(x, y, width, height)
                    if(!showCollisionShapes) continue
                    let shape = tileSet.collisionShape(tileNum)
                    if(shape === undefined) continue
                    collisionShape.drawResized(x + distToScreen(shape.centerX - shape.halfWidth)
                        , y + distToScreen(shape.centerY - shape.halfHeight)
                        , width * shape.width, height * shape.height, shape.shapeType)
                }
            }
        })
    }

    tileColumn(tileNum) {
        return tileNum % this.#columns
    }

    tileRow(tileNum) {
        return Math.floor(tileNum / this.#columns)
    }

    tileForPoint(point) {
        let column = Math.floor((point.centerX - this.leftX) / this.cellWidth)
        if(column < 0 || column >= this.#columns) return -1
        let row = Math.floor((point.centerY - this.topY) / this.cellHeight)
        if(row < 0 || row >= this.#rows) return -1
        return column + row * this.#columns
    }
}