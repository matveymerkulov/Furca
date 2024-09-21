import {Img} from "./image.js"
import {getTexturePart} from "./texture.js"
import {texture} from "./system.js"

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

    static create(template) {
        let object = template.object

        if(object === undefined) {
            object = new ImageArray(texture[template.texture], template.columns, template.rows
                , template.xMul, template.yMul, template.widthMul, template.heightMul)
            template.object = object
        }

        return object
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
}