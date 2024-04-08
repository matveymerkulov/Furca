import {clamp, selectKey, tiles} from "./main.js"
import {tileSet} from "../src/project.js"
import {canvasUnderCursor, ctx, distToScreen, setCanvas} from "../src/canvas.js"
import {drawDashedRegion} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"
import {brushSize, setBlockSize} from "./tile_map.js"
import {visibility} from "../src/tile_set.js"
import {blockType} from "../src/block.js"
import {tilesPerRow} from "./tile_zoom.js"
import {updateY0, y0} from "./tile_pan.js"

export let currentTile = 1, altTile = 0, currentTileSet, currentBlock
export let maxY0 = 0

export function renderTileSet() {
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
            images.image(i).drawResized(x, y, size, size)
            if(set === currentTileSet && (currentTile === i || altTile === i)) {
                drawDashedRegion(x, y, size, size)
            }
            if(canvasUnderCursor !== tiles) continue
            if(selectKey.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                currentTile = i
                currentBlock = undefined
                setBlockSize(brushSize, brushSize)
                currentTileSet = set
            }
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
            ctx.drawImage(texture, tx, ty, tWidth, tHeight, x, y, size, size)

            if(selectKey.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                currentBlock = block
                if(block.type === blockType.block) {
                    setBlockSize(block.width, block.height)
                } else if(block.type === blockType.frame) {
                    setBlockSize(1, 1)
                }
                currentTile = -1
                currentTileSet = set
            }

            if(set === currentTileSet && currentBlock === block) {
                drawDashedRegion(x, y, size, size)
            }
        }
    }
    maxY0 = Math.max(y + size - tiles.viewport.height + y0, 0)
    updateY0()
}