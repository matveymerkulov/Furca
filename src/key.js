export let keys = []

export default class Key {
    #isDown = false
    #wasPressed = false
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
                if(!this.#isDown) {
                    this.#wasPressed = true
                }
                this.#isDown = true
            }
        })
    }

    processKeyUpEvent(event) {
        this.items.forEach(item => {
            if(event.code === item.code) {
                this.#isDown = false
            }
        })
    }

    processMouseDownEvent(event) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                if(!this.#isDown) {
                    this.#wasPressed = true
                }
                this.#isDown = true
            }
        })
    }

    processMouseUpEvent(event) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                this.#isDown = false
            }
        })
    }

    processWheelEvent(dir) {
        this.items.forEach(item => {
            if(dir === item.dir) {
                this.#wasPressed = true
            }
        })
    }

    get isDown() {
        return this.#isDown
    }

    get wasPressed() {
        return this.#wasPressed
    }

    reset() {
        this.#wasPressed = false
    }
}