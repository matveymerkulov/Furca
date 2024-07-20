import {delKey, selectKey, tiles} from "./main.js"
import {tileSet} from "../src/project.js"
import {canvasUnderCursor, ctx} from "../src/canvas.js"
import {drawDashedRegion} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"
import {brushSize, setBlockSize} from "./tile_map.js"
import {visibility} from "../src/tile_set.js"
import {blockType} from "../src/block.js"
import {tilesPerRow} from "./tile_zoom.js"
import {updateY0, y0} from "./tile_pan.js"
import {currentWindow} from "../src/gui/window.js"

export let currentTile = 1, currentTileSet, currentBlock
export let maxY0 = 0

function processTiles(tileFunction, blockFunction) {
    let quantity = 0
    for(const set of Object.values(tileSet)) {
        quantity += set.images.quantity
    }

    let size = tiles.viewport.width / tilesPerRow
    let x, y
    let pos = -1

    for(const set of Object.values(tileSet)) {
        function incrementPos() {
            pos++
            x = size * (pos % tilesPerRow)
            y = size * Math.floor(pos / tilesPerRow) - y0
        }

        let images = set.images
        for(let i = 0; i < images.quantity; i++) {
            if(set.visibility[i] !== visibility.visible) continue
            incrementPos()

            tileFunction(set, images, i, x, y, size)
        }

        let texture = images.texture
        for(let block of set.blocks) {
            incrementPos()
            let cellWidth = texture.width / images.columns
            let cellHeight = texture.height / images.rows
            let tx = block.x * cellWidth
            let ty = block.y * cellHeight
            let tWidth = block.width * cellWidth
            let tHeight = block.height * cellHeight



            blockFunction(set, block, texture, tx, ty, tWidth, tHeight, x, y, size)
        }
    }

    maxY0 = Math.max(y + size - tiles.viewport.height + y0, 0)
    updateY0()
}


export function renderTileSet() {
    processTiles((set, images, i, x, y, size) => {
        images.image(i).drawResized(x, y, size, size)

        if(set !== currentTileSet) return

        if(currentTile === i) {
            drawDashedRegion(x + 1, y + 1, size - 2, size - 2)
        }

        if(set.altTile === i) {
            drawDashedRegion(x + 3, y + 3, size - 6, size - 6)
        }
    }, (set, block, texture, tx, ty, tWidth, tHeight, x, y, size) => {
        let x0, y0, width0, height0
        if(tWidth >= tHeight) {
            width0 = size
            height0 = size * tHeight / tWidth
            x0 = x
            y0 = y + 0.5 * (size - height0)
        } else {
            height0 = size
            width0 = size * tWidth / tHeight
            x0 = x + 0.5 * (size - width0)
            y0 = y + 0.5 * (size - height0)
        }

        ctx.drawImage(texture, tx, ty, tWidth, tHeight, x0, y0, width0, height0)

        if(set === currentTileSet && currentBlock === block) {
            drawDashedRegion(x, y, size, size)
        }
    })
}

export function tileSetOperations() {
    processTiles((set, images, i, x, y, size) => {
        if((selectKey.wasPressed || delKey.wasPressed) && boxWithPointCollision(canvasMouse, x, y, size, size)
            && currentWindow === undefined && canvasUnderCursor === tiles) {
            if(selectKey.wasPressed) {
                currentTile = i
                currentBlock = undefined
                setBlockSize(brushSize, brushSize)
                currentTileSet = set
            } else {
                set.altTile = set.altTile === i ? -1 : i
            }
        }
    }, (set, block, texture, tx, ty, tWidth, tHeight, x, y, size) => {
        if(selectKey.wasPressed && boxWithPointCollision(canvasMouse, x, y, size, size)
            && currentWindow === undefined && canvasUnderCursor === tiles) {
            currentBlock = block
            if(block.type === blockType.block) {
                setBlockSize(block.width, block.height)
            } else if(block.type === blockType.frame) {
                setBlockSize(1, 1)
            }
            currentTile = -1
            currentTileSet = set
        }
    })
}