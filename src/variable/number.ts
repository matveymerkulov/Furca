import {Func} from "../function/func.js"
import {num} from "../system.js"

export class Num extends Func {
    constructor(public value = 0) {
        super()
    }

    increment(amount = 1, limit = undefined) {
        this.value += amount
        if(limit !== undefined && this.value > limit) this.value = limit
    }

    decrement(amount = 1, limit = undefined) {
        this.value -= amount
        if(limit !== undefined && this.value < limit) this.value = limit
    }

    toNumber() {
        return this.value
    }

    toString() {
        return this.value
    }

    getString() {
        return "var(" + this.value + ")"
    }
}