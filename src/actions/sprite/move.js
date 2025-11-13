import {Action} from "../action.js"

export class Move extends Action {
    execute(object) {
        object.move()
    }
}