export class TextureArray {
    #initialTextures
    #textures
    constructor(texture, columns, rows) {
        this.texture = texture
        this.columns = columns
        this.rows = rows

        const quantity = columns * rows
        const width = Math.floor(texture.shapeWidth / columns)
        const height = Math.floor(texture.shapeHeight / rows)

        const textures = Array(quantity)
        for(let i = 0; i < quantity; i++) {
            textures[i] = new PIXI.Texture({
                source: texture,
                frame: new PIXI.Rectangle((i % columns) * width, Math.floor(i / columns) * height,
                width, height),
                defaultAnchor: new PIXI.Point(0.5, 0.5),
            })
        }

        this.#initialTextures = textures
        this.#textures = Array.from(textures)
    }

    toString() {
        return `new ImageArray(texture.${this.texture.id}, ${this.columns}, ${this.rows})`
    }

    image(num) {
        return this.#textures[num]
    }

    get textures() {
        return this.#textures
    }

    initialTexture(num) {
        return this.#initialTextures[num]
    }

    setTexture(num, texture) {
        this.#textures[num] = texture
    }

    get quantity() {
        return this.#textures.length
    }
}