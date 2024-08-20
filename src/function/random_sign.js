import {Function} from "./function.js"

export class RandomSign extends Function {
    toNumber() {
        return randomSign()
    }
}

export let rnds = new RandomSign()