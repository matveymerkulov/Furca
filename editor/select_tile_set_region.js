import {tileHeight, tileSetWindow, tileWidth} from "./main.js"
import {canvasMouse} from "../src/system.js"
import Drag from "../src/drag.js"
import {currentWindow} from "../src/gui/window.js"
import Region from "../src/region.js"
import {currentTileSet} from "./tile_set.js"

export let tileSetRegion

export function resetRegionSelector() {
    tileSetRegion = undefined
}

export default class SelectTileSetRegion extends Drag {
    #x
    #y

    conditions() {
        return currentWindow === tileSetWindow
    }

    start() {
        this.#x = Math.floor(canvasMouse.x / tileWidth)
        this.#y = Math.floor(canvasMouse.y / tileHeight)
        tileSetRegion = new Region(currentTileSet.images.columns)
    }

    process() {
        if(tileSetRegion === undefined) return
        let width = Math.floor(canvasMouse.x / tileWidth) - this.#x
        let height = Math.floor(canvasMouse.y / tileHeight) - this.#y
        tileSetRegion.modify(currentTileSet.images.columns, this.#x, this.#y, width, height)
    }
}