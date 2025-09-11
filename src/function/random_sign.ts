import {Func} from "./func.js"
import {randomSign} from "../functions.js"

export class RandomSign extends Func {
    toNumber() {
        return randomSign()
    }
}

export let rnds = new RandomSign()