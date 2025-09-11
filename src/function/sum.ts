import {num} from "../system.js"
import {Func} from "./func.js"

export class Sum extends Func {
    constructor(public value1: Func, public value2: Func) {
        super()
    }

    toNumber() {
        return num(this.value1) + num(this.value2)
    }
}