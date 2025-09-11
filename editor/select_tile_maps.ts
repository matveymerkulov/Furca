import {Drag} from "../src/drag.js"
import {Box} from "../src/box.js"
import {mouse} from "../src/system.js"
import {currentMode, mode, objectUnderCursor} from "./tile_map.js"
import {world} from "../src/project.js"
import {abs} from "../../RuWebQuest 2/src/functions.js"
import {Sprite} from "../src/sprite.js";
import {Region} from "../src/region.js";

export let selectedObjects: Sprite[] = [], mapSelectionRegion: Box

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