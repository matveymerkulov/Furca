import {maps, tileHeight, tiles, tileSetWindow, tileWidth} from "./main.js"
import {canvasMouse, mouse} from "../src/system.js"
import Drag from "../src/drag.js"
import {currentWindow} from "../src/gui/window.js"
import Region from "../src/region.js"
import {currentBlock, currentTileSet} from "./tile_set.js"
import {Block, blockType} from "../src/block.js"
import {currentCanvas} from "../src/canvas.js"
import {currentTileMap, setBlockSize, setTiles} from "./tile_map.js"

export let mapRegion

export default class SelectMapRegion extends Drag {
    #x
    #y

    conditions() {
        return currentCanvas === maps && currentTileMap !== undefined && currentBlock !== undefined
            && currentBlock.type === blockType.frame
    }

    start() {
        this.#x = Math.floor((mouse.x - currentTileMap.leftX) / currentTileMap.cellWidth)
        this.#y = Math.floor((mouse.y - currentTileMap.topY) / currentTileMap.cellHeight)
        mapRegion = new Block()
    }

    process() {
        let width = Math.floor((mouse.x - currentTileMap.leftX) / currentTileMap.cellWidth) - this.#x
        let height = Math.floor((mouse.y - currentTileMap.topY) / currentTileMap.cellHeight) - this.#y
        mapRegion.modify(currentTileSet.images.columns, this.#x, this.#y, width, height)
    }

    end() {
        setBlockSize(mapRegion.width + 1, mapRegion.height + 1)
        setTiles(mapRegion.x, mapRegion.y, mapRegion.width + 1, mapRegion.height + 1,undefined, currentBlock)
        mapRegion = undefined
        setBlockSize(1, 1)
    }
}