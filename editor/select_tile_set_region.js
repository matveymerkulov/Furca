import {tileHeight, tileWidth} from "./main.js"
import {canvasMouse} from "../src/system.js"
import {Drag} from "../src/drag.js"
import {Region} from "../src/region.js"
import {currentTileSet} from "./tile_set.js"
import {canvasUnderCursor, currentCanvas} from "../src/canvas.js"
import {floor} from "../src/functions.js"

export let tileSetRegion

export function resetRegionSelector() {
    tileSetRegion = undefined
}

export default class SelectTileSetRegion extends Drag {
    #x
    #y

    conditions() {
        return canvasUnderCursor === currentCanvas
    }

    start() {
        this.#x = floor(canvasMouse.x / tileWidth)
        this.#y = floor(canvasMouse.y / tileHeight)
        tileSetRegion = new Region(currentTileSet.images.columns)
    }

    get width() {
        return floor(canvasMouse.x / tileWidth) - this.#x
    }

    get height() {
        return floor(canvasMouse.y / tileHeight) - this.#y
    }

    process() {
        if(tileSetRegion === undefined) return
        tileSetRegion.modify(currentTileSet.images.columns, this.#x, this.#y, this.width, this.height)
    }

    end() {
        if(this.width === 0 && this.height === 0) {
            tileSetRegion = undefined
        }
    }
}