export default class Area {
    constructor(leftX, topY, width, height) {
        this.leftX = leftX
        this.topY = topY
        this.width = width
        this.height = height
    }

    get rightX() {
        return this.leftX + this.width
    }

    get bottomY() {
        return this.topY + this.height
    }

    hasPoint(px, py) {
        return px >= this.leftX && px < this.rightX && py >= this.topY && py < this.bottomY
    }
}