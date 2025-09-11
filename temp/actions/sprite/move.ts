import {Action} from "../action"
import {Sprite} from "../../sprite";
import {Shape} from "../../shape";

export class Move extends Action {
    constructor(public object: Shape) {
        super()
    }

    execute() {
        this.object.move()
    }
}