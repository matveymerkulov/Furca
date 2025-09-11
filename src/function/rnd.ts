import {num} from "../system.js"
import {Func} from "./func.js"
import {rnd} from "../functions.js"
import {Num} from "../variable/number.js";

export class Rnd extends Func {
    constructor(public from: Func, public to: Func = undefined) {
        super()
    }

    toNumber() {
        return rnd(num(this.from), num(this.to))
    }
}