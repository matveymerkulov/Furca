import {mouse} from "../src/system.js"
import {Drag} from "../src/drag.js"
import {currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {Block, blockType} from "../src/block.js"
import {currentTileMap, rectangleMode, setBlockSize, setTiles} from "./tile_map.js"

export let mapRegion, regionTileMap, regionTileSet

export default class SelectMapRegion extends Drag {
    #x
    #y

    conditions() {
        return currentTileMap !== undefined
            && ((currentBlock !== undefined && currentBlock.type === blockType.frame) || rectangleMode)
    }

    start() {
        this.#x = Math.floor((mouse.x - currentTileMap.leftX) / currentTileMap.cellWidth)
        this.#y = Math.floor((mouse.y - currentTileMap.topY) / currentTileMap.cellHeight)
        mapRegion = new Block()
        regionTileMap = currentTileMap
        regionTileSet = currentTileSet
    }

    process() {
        let width = Math.floor((mouse.x - regionTileMap.leftX) / regionTileMap.cellWidth) - this.#x
        let height = Math.floor((mouse.y - regionTileMap.topY) / regionTileMap.cellHeight) - this.#y
        if(this.#x + width < 0) width = -this.#x
        if(this.#x + width >= regionTileMap.columns) width = regionTileMap.columns - this.#x - 1
        if(this.#y + height < 0) height = -this.#y
        if(this.#y + height >= regionTileMap.rows) height = regionTileMap.rows - this.#y - 1

        if(currentBlock !== undefined) {
            if(currentBlock.type === blockType.block) {
                if(width < currentBlock.width - 1) width = currentBlock.width - 1
                if(height < currentBlock.height - 1) height = currentBlock.height - 1
                width = Math.floor((width + 1) / currentBlock.width) * currentBlock.width - 1
                height = Math.floor((height + 1) / currentBlock.height) * currentBlock.height - 1
            } else if(currentBlock.type === blockType.frame) {
                if(currentBlock.width < 3) width = currentBlock.width - 1
                if(currentBlock.height < 3) height = currentBlock.height - 1
            }
        }
        mapRegion.modify(regionTileSet.images.columns, this.#x, this.#y, width, height)
    }

    end() {
        setBlockSize(mapRegion.width + 1, mapRegion.height + 1)
        setTiles(regionTileMap, regionTileSet, mapRegion.x, mapRegion.y, mapRegion.width + 1, mapRegion.height + 1
            , currentBlock === undefined ? currentTile : undefined, currentBlock)
        mapRegion = undefined
        setBlockSize(1, 1)
    }
}