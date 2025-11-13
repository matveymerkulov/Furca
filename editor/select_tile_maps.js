import {Drag} from "../src/drag.js"
import {Box} from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor} from "./tile_map.js"
import {world} from "../src/project.js"

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
        mapSelectionRegion.setShapeCorner(this.#x, this.#y)
    }

    end() {
        selectedObjects = []
        mapSelectionRegion.shapeWidth = Math.abs(mapSelectionRegion.shapeWidth)
        mapSelectionRegion.shapeHeight = Math.abs(mapSelectionRegion.shapeHeight)
        for(const object of world.children) {
            if(object.isInside(mapSelectionRegion)) selectedObjects.push(object)
        }
        mapSelectionRegion = undefined
    }
}

export function clearSelection() {
    selectedObjects = []
}