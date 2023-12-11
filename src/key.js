export let keys = []

export default class Key {
    #_isDown = false
    #_wasPressed = false
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
        keys.push(this)
    }

    processKeyDownEvent(event) {
        this.items.forEach(item => {
            if(event.code === item.code) {
                if(!this.#_isDown) {
                    this.#_wasPressed = true
                }
                this.#_isDown = true
            }
        })
    }

    processKeyUpEvent(event) {
        this.items.forEach(item => {
            if(event.code === item.code) {
                this.#_isDown = false
            }
        })
    }

    processMouseDownEvent(event) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                if(!this.#_isDown) {
                    this.#_wasPressed = true
                }
                this.#_isDown = true
            }
        })
    }

    processMouseUpEvent(event) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                this.#_isDown = false
            }
        })
    }

    processWheelEvent(dir) {
        this.items.forEach(item => {
            if(dir === item.dir) {
                this.#_wasPressed = true
            }
        })
    }

    get isDown() {
        return this.#_isDown
    }

    get wasPressed() {
        return this.#_wasPressed
    }

    reset() {
        this.#_wasPressed = false
    }
}