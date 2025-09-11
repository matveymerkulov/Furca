import {Action} from "../action"
import {apsk} from "../../system"
import {Sprite} from "../../sprite";
import {Func} from "../../function/func";

export class AnimateSize extends Action {
    time = 0

    constructor(public object: Sprite, public func: Func) {
        super()
    }

    execute() {
        this.time += apsk
        this.object.width = this.object.height = this.func.calculate(this.time)
    }
}