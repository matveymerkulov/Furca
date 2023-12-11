export default class TileSet {
    constructor(images) {
        this.images = images
        this.collision = new Array(images._images.length)
    }

    setCollision(sprite, from, to) {
        if(from instanceof Array) {
            for(let tileNum of from) {
                this.collision[tileNum] = sprite
            }
            return
        }

        if(to === undefined) {
            to = this.collision.length
        }

        for(let tileNum = from; tileNum <= to; tileNum++) {
            this.collision[tileNum] = sprite
        }
    }
}