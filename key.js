export let key = []

export default class Key {
    constructor(name, code) {
        this.name = name
        this.code = code
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