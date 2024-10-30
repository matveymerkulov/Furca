import {Drag} from "../src/drag.js"
import {Box} from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode, tileMapUnderCursor} from "./tile_map.js"
import {tileMap, world} from "../src/project.js"
import {Layer} from "../src/layer.js"
import {abs} from "../src/functions.js"

export let selectedTileMaps = [], mapSelectionRegion

export default class SelectTileMaps extends Drag {
    #x
    #y

    conditions() {
        return tileMapUnderCursor === undefined && currentMode === mode.maps
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

    select(object) {
        if(object instanceof Layer) {
            for(const item of object.items) {
                this.select(item)
            }
        } else if(object.isInside(mapSelectionRegion)) {
            selectedTileMaps.push(object)
        }
    }

    end() {
        selectedTileMaps = []
        mapSelectionRegion.width = abs(mapSelectionRegion.width)
        mapSelectionRegion.height = abs(mapSelectionRegion.height)
        for(const object of world.items) {
            this.select(object)
        }
        mapSelectionRegion = undefined
    }
}

export function clearSelection() {
    selectedTileMaps = []
}