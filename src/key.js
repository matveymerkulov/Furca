export let key = []

export default class Key {
    constructor(...codes) {
        this.items = []
        codes.forEach(code => {
            let item = {}
            switch(code) {
                case "LMB":
                    item.button = 0
                    break
                case "MMB":
                    item.button = 1
                    break
                case "RMB":
                    item.button = 2
                    break
                case "WheelUp":
                    item.dir = -1
                    break
                case "WheelDown":
                    item.dir = 1
                    break
                default:
                    item.code = code
            }
            this.items.push(item)
        })
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