import {Function} from "../function.js"
import {num} from "../system.js"

export default class NumericVariable extends Function {
    constructor(value = 0) {
        super()
        this.value = num(value)
    }

    increment(amount = 1, limit) {
        this.value += amount
        if(limit !== undefined && this.value > limit) this.value = limit
    }

    decrement(amount = 1, limit) {
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