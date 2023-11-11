import {Action} from "../action.js"

export default class Move extends Action {
    constructor(object) {
        super()
        this.object = object
    }

    execute() {
        this.object.move()
    }
}