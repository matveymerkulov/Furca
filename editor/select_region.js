import {tileSetWindow} from "./main.js"
import {canvasMouse} from "../src/system.js"
import Drag from "../src/drag.js"
import {currentWindow} from "../src/gui/window.js"
import Region from "../src/region.js"
import {currentTileSet} from "./tile_set.js"

export let regionSelector, tileWidth, tileHeight

export function resetRegionSelector() {
    regionSelector = undefined
}

export function setTileWidth(width, height) {
    tileWidth = width
    tileHeight = height
}

export default class SelectRegion extends Drag {
    #x
    #y

    conditions() {
        return currentWindow === tileSetWindow
    }

    start() {
        this.#x = Math.floor(canvasMouse.x / tileWidth)
        this.#y = Math.floor(canvasMouse.y / tileHeight)
        regionSelector = new Region(currentTileSet.images.columns)
    }

    process() {
        if(regionSelector === undefined) return
        let width = Math.floor(canvasMouse.x / tileWidth) - this.#x
        let height = Math.floor(canvasMouse.y / tileHeight) - this.#y
        regionSelector.modify(currentTileSet.images.columns, this.#x, this.#y, width, height)
    }
}