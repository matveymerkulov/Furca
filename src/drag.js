import {current} from "./variable/sprite.js"

export default class Drag {
    #key

    conditions() {
        return true
    }

    start() {}
    process() {}
    end() {}

    static #drags = []
    static #current

    static add(drag, key) {
        drag.#key = key
        this.#drags.push(drag)
    }

    static execute() {
        if(this.#current === undefined) {
            for(let drag of this.#drags) {
                if(drag.#key.wasPressed && drag.conditions()) {
                    drag.start()
                    this.#current = drag
                    break
                }
            }
            return
        }

        this.#current.process()

        if(this.#current.#key.isDown) return

        this.#current.end()
        this.#current = undefined
    }
}