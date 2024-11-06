import {Drag} from "../src/drag.js"
import {Box} from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor} from "./tile_map.js"
import {tileMap, world} from "../src/project.js"
import {Layer} from "../src/layer.js"
import {abs} from "../src/functions.js"

export let selectedObjects = [], mapSelectionRegion

export class SelectTileMaps extends Drag {
    #x
    #y

    conditions() {
        return objectUnderCursor === undefined && currentMode === mode.maps
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
        selectedObjects = []
        mapSelectionRegion.width = abs(mapSelectionRegion.width)
        mapSelectionRegion.height = abs(mapSelectionRegion.height)
        for(const object of world.items) {
            if(object.isInside(mapSelectionRegion)) selectedObjects.push(object)
        }
        mapSelectionRegion = undefined
    }
}

export function clearSelection() {
    selectedObjects = []
}