import {Action} from "../action"
import {apsk} from "../../system"
import {Sprite} from "../../sprite";
import {Func} from "../../function/func";

export class Blink extends Action {
    time = 0

    constructor(public object: Sprite, public func: Func) {
        super()
    }


    execute() {
        this.time += apsk
        this.object.visible = this.func.calculate(this.time) >= 0.5
    }
}