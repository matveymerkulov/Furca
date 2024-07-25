import {maps} from "./main.js"
import {mouse} from "../src/system.js"
import Drag from "../src/drag.js"
import {currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {Block, blockType} from "../src/block.js"
import {currentCanvas} from "../src/canvas.js"
import {currentTileMap, rectangleMode, setBlockSize, setTiles} from "./tile_map.js"

export let mapRegion

export default class SelectMapRegion extends Drag {
    #x
    #y

    conditions() {
        return currentCanvas === maps && currentTileMap !== undefined
            && ((currentBlock !== undefined && currentBlock.type === blockType.frame) || rectangleMode)
    }

    start() {
        this.#x = Math.floor((mouse.x - currentTileMap.leftX) / currentTileMap.cellWidth)
        this.#y = Math.floor((mouse.y - currentTileMap.topY) / currentTileMap.cellHeight)
        mapRegion = new Block()
    }

    process() {
        let width = Math.floor((mouse.x - currentTileMap.leftX) / currentTileMap.cellWidth) - this.#x
        let height = Math.floor((mouse.y - currentTileMap.topY) / currentTileMap.cellHeight) - this.#y
        if(currentBlock !== undefined && currentBlock.type === blockType.block) {
            if(width < currentBlock.width) width = currentBlock.width
            if(height < currentBlock.height) height = currentBlock.height
            width = Math.floor((width + 1) / currentBlock.width) * currentBlock.width - 1
            height = Math.floor((height + 1) / currentBlock.height) * currentBlock.height - 1
        }
        mapRegion.modify(currentTileSet.images.columns, this.#x, this.#y, width, height)
    }

    end() {
        setBlockSize(mapRegion.width + 1, mapRegion.height + 1)
        setTiles(mapRegion.x, mapRegion.y, mapRegion.width + 1, mapRegion.height + 1
            , currentBlock === undefined ? currentTile : undefined, currentBlock)
        mapRegion = undefined
        setBlockSize(1, 1)
    }
}