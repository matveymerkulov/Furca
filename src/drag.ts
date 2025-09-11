import {Action} from "./actions/action.js"
import {Key} from "./key.js";

let current: Drag

export class Drag extends Action {
    key: Key

    conditions() {
        return true
    }

    start() {}
    process() {}
    end() {}

    execute() {
        if(current === undefined) {
            if(this.key.keyWasPressed && this.conditions()) {
                this.start()
                current = this
            }
        }
        if(current !== this) return

        current.process()

        if(current.key.keyIsDown) return

        current.end()
        current = undefined
    }
}

export function deleteCurrentDrag() {
    current = undefined
}