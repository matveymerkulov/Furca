import {Func} from "./func.js"

export class Cos extends Func {
    time = 0

    constructor(public length: number, public amplitude = 1, public xshift = 0, public yshift = 0) {
        super()
    }

    calculate(x: number) {
        return this.yshift + this.amplitude * Math.cos((this.xshift + x) * 2 * Math.PI / this.length)
    }
}