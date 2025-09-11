import {num} from "../system.js"
import {Func} from "./func.js"
import { RandomSign } from "./random_sign.js"
import { Rnd } from "./rnd.js"

export class Mul extends Func {
    constructor(public value1: Func, public value2: Func) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toNumber() {
        return num(this.value1) * num(this.value2)
    }
}