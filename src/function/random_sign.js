import {Function} from "./function.js"
import {randomSign} from "../functions.js"

export class RandomSign extends Function {
    toNumber() {
        return randomSign()
    }
}

export let rnds = new RandomSign()