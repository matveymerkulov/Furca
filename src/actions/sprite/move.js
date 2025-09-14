import {Action} from "../action.js"

export class Move extends Action {
    constructor(object) {
        super()
        this.object = object
    }

    execute() {
        this.object.move()
    }
}