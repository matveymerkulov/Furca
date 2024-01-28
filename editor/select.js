import Drag from "../src/drag.js"
import Box from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode as modes, tileMapUnderCursor,} from "./main.js"
import {tileMap} from "../src/project.js"

export let selected = [], selector

export default class Select extends Drag {
    #x
    #y

    conditions() {
        return tileMapUnderCursor === undefined && currentMode === modes.maps
    }

    start() {
        this.#x = mouse.x
        this.#y = mouse.y
        selector = new Box()
    }

    process() {
        selector.setSize(mouse.x - this.#x, mouse.y - this.#y)
        selector.setCorner(this.#x, this.#y)
    }

    end() {
        selected = []
        for(const map of Object.values(tileMap)) {
            if(map.isInside(selector)) {
                selected.push(map)
            }
        }
        selector = undefined
    }
}

export function clearSelection() {
    selected = []
}