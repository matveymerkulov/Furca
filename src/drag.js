import {Action} from "./actions/action.js"

export default class Drag extends Action {
    key

    conditions() {
        return true
    }

    start() {}
    process() {}
    end() {}

    static current

    execute() {
        if(this.current === undefined) {
            if(this.key.wasPressed && this.conditions()) {
                this.start()
                this.current = this
            }
            return
        }
        if(this.current !== this) return

        this.current.process()

        if(this.current.key.isDown) return

        this.current.end()
        this.current = undefined
    }
}