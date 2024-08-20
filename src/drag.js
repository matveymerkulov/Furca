import {Action} from "./actions/action.js"

let current

export class Drag extends Action {
    key

    conditions() {
        return true
    }

    start() {}
    process() {}
    end() {}

    execute() {
        if(current === undefined) {
            if(this.key.wasPressed && this.conditions()) {
                this.start()
                current = this
            }
        }
        if(current !== this) return

        current.process()

        if(current.key.isDown) return

        current.end()
        current = undefined
    }
}

export function deleteCurrentDrag() {
    current = undefined
}