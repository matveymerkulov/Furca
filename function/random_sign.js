import {randomSign} from "../system.js"
import {Function} from "../function.js"

export default class RandomSign extends Function {
    toNumber() {
        return randomSign()
    }
}

export let rnds = new RandomSign()