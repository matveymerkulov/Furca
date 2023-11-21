export let key = []

export default class Key {
    constructor(code) {
        switch(code) {
            case "LMB":
                this.button = 0
                break
            case "MMB":
                this.button = 1
                break
            case "RMB":
                this.button = 2
                break
            case "WheelUp":
                this.dir = -1
                break
            case "WheelDown":
                this.dir = 1
                break
            default:
                this.code = code
        }
        this._wasPressed = false
        this._isDown = false
        key.push(this)
    }

    get isDown() {
        return this._isDown
    }

    get wasPressed() {
        return this._wasPressed
    }
}