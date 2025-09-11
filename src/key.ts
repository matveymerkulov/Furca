export let keys: Array<Key> = []

class KeyItem {
    button = -1
    dir = 0
    code = ""
}

export class Key {
    keyIsDown = false
    keyWasPressed = false
    items = new Array<KeyItem>
    constructor(...codes: Array<string>) {
        codes.forEach(code => {
            let item = new KeyItem
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


    processKeyDownEvent(event: KeyboardEvent) {
        this.items.forEach(item => {
            if(event.code === item.code) {
                if(!this.keyIsDown) {
                    this.keyWasPressed = true
                }
                this.keyIsDown = true
            }
        })
    }

    processKeyUpEvent(event: KeyboardEvent) {
        this.items.forEach(item => {
            if(event.code === item.code) {
                this.keyIsDown = false
            }
        })
    }

    processMouseDownEvent(event: MouseEvent) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                if(!this.keyIsDown) {
                    this.keyWasPressed = true
                }
                this.keyIsDown = true
            }
        })
    }

    processMouseUpEvent(event: MouseEvent) {
        this.items.forEach(item => {
            if(event.button === item.button) {
                this.keyIsDown = false
            }
        })
    }

    processWheelEvent(dir: number) {
        this.items.forEach(item => {
            if(dir === item.dir) {
                this.keyWasPressed = true
            }
        })
    }

    get isDown() {
        return this.keyIsDown
    }

    get wasPressed() {
        return this.keyWasPressed
    }

    reset() {
        this.keyWasPressed = false
    }
}