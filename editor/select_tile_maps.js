import Drag from "../src/drag.js"
import Box from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode as modes} from "./main.js"
import {tileMap} from "../src/project.js"
import {tileMapUnderCursor} from "./tile_map.js"

export let selectedTileMaps = [], mapSelectionRegion

export default class SelectTileMaps extends Drag {
    #x
    #y

    conditions() {
        return tileMapUnderCursor === undefined && currentMode === modes.maps
    }

    start() {
        this.#x = mouse.x
        this.#y = mouse.y
        mapSelectionRegion = new Box()
    }

    process() {
        mapSelectionRegion.setSize(mouse.x - this.#x, mouse.y - this.#y)
        mapSelectionRegion.setCorner(this.#x, this.#y)
    }

    end() {
        selectedTileMaps = []
        for(const map of Object.values(tileMap)) {
            if(map.isInside(mapSelectionRegion)) {
                selectedTileMaps.push(map)
            }
        }
        mapSelectionRegion = undefined
    }
}

export function clearSelection() {
    selectedTileMaps = []
}