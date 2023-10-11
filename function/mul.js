import {num} from "../system.js"
import {Function} from "../function.js"

export default class Mul extends Function {
    constructor(value1, value2) {
        super()
        this.value1 = value1
        this.value2 = value2
    }

    toNumber() {
        return num(this.value1) * num(this.value2)
    }
}