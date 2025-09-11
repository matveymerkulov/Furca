import {Action} from "../action"
import {apsk} from "../../system"
import {Sprite} from "../../sprite";
import {Func} from "../../function/func";

export class AnimateOpacity extends Action {
    time = 0

    constructor(public object: Sprite, public func: Func) {
        super()
    }

    execute() {
        this.time += apsk
        this.object.opacity = this.func.calculate(this.time)
    }
}