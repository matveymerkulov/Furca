import {Img} from "./image.js"
import {getTexturePart} from "./texture.js"

export class ImageArray {
    #images
    constructor(texture, columns, rows, xMul = 0.5, yMul = 0.5
                , widthMul = 1.0, heightMul = 1.0) {
        this.texture = texture
        this.columns = columns
        this.rows = rows
        this.xMul = xMul
        this.yMul = yMul
        this.heightMul = heightMul
        this.widthMul = widthMul
        const quantity = columns * rows
        const width = Math.floor(texture.width / columns)
        const height = Math.floor(texture.height / rows)
        const images = Array(quantity)
        for(let i = 0; i < quantity; i++) {
            images[i] = new Img(getTexturePart(texture, (i % columns) * width, Math.floor(i / columns) * height
                , width, height), 0, 0, width, height, xMul, yMul, widthMul, heightMul)
        }
        this.#images = images
    }

    toString() {
        return `new ImageArray(texture.${this.texture.id}, ${this.columns}, ${this.rows}, ${this.xMul}, ${this.yMul}`
            + `, ${this.heightMul}, ${this.widthMul})`
    }

    image(num) {
        return this.#images[num]
    }

    get quantity() {
        return this.#images.length
    }

    addColorBlocks(color, column, row, columns, rows, addImages) {
        const width = Math.floor(this.texture.width / this.columns)
        const height = Math.floor(this.texture.height / this.rows)

        if(addImages) {
            for(let y = 0; y < rows; y++) {
                for(let x = 0; x < columns; x++) {
                    this.#images.push(new Img(getTexturePart(this.texture, (x + column) * width, (y + row) * height
                            , width, height, color), 0, 0, width, height))
                }
            }
        }

        return new Img(getTexturePart(this.texture, column * width, row * height
            , columns * width, rows * height, color), 0, 0, columns * width, rows * height)
    }
}