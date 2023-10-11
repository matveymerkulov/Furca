import {num, rnd} from "../system.js"
import {Function} from "../function.js"

export default class Rnd extends Function {
    constructor(from, to) {
        super()
        this.from = from
        this.to = to
    }

    toNumber() {
        return rnd(num(this.from), num(this.to))
    }
}