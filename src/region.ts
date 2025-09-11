 export class Region {
    constructor(public columns: number, public x = 0, public y = 0, public width = 0, public height = 0) {
        this.modify(columns, x, y, width, height)
    }

    modify(columns: number, x: number, y: number, width: number, height: number) {
        this.columns = columns
        this.x = width > 0 ? x : x + width
        this.y = height > 0 ? y : y + height
        this.width = Math.abs(width)
        this.height = Math.abs(height)
    }

    process(code: (region: Region, tileNum: number) => void) {
        for(let y = 0; y <= this.height; y++) {
            for(let x = 0; x <= this.width; x++) {
                code(this, x + this.x + (y + this.y) * this.columns)
            }
        }
    }

    collidesWithTile(x: number, y: number) {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height
    }
}