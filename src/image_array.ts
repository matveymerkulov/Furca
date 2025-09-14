import {Img} from "./image.js"
import {getTexturePart} from "./texture.js"
import {texture} from "./system.js"

export class ImageArray {
    images: Array<Img>
    constructor(public texture: HTMLImageElement, public columns: number, public rows: number
                , public xMul = 0.5, public yMul = 0.5, public widthMul = 1.0, public heightMul = 1.0) {
        this.init(columns, rows)
    }

    init(newColumns: number, newRows: number) {
        const tex = this.texture
        const quantity = newColumns * newRows
        const width = Math.floor(tex.width / newColumns)
        const height = Math.floor(tex.height / newRows)
        const images = new Array<Img>(quantity)
        for(let i = 0; i < quantity; i++) {
            images[i] = new Img(getTexturePart(tex, (i % newColumns) * width, Math.floor(i / newColumns) * height
                , width, height), 0, 0, width, height, this.xMul, this.yMul, this.widthMul, this.heightMul)
        }
        this.images = images
        this.columns = newColumns
        this.rows = newRows
    }

    static create(template: any) {
        let object = template.object

        if(object === undefined) {
            object = new ImageArray(texture.get(template.texture), template.columns, template.rows
                , template.xMul, template.yMul, template.widthMul, template.heightMul)
            template.object = object
        }

        return object
    }

    toString() {
        return `new ImageArray(texture.${this.texture.id}, ${this.columns}, ${this.rows}, ${this.xMul}, ${this.yMul}`
            + `, ${this.heightMul}, ${this.widthMul})`
    }

    image(num: number) {
        return this.images[num]
    }

    setImage(num: number, image: Img) {
        this.images[num] = image
    }

    get quantity() {
        return this.images.length
    }
}