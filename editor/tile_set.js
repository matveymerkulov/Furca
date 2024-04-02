import {selectKey, tiles} from "./main.js"
import {tileSet} from "../src/project.js"
import {canvasUnderCursor, ctx, distToScreen, setCanvas} from "../src/canvas.js"
import {drawDashedRegion} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"
import {brushSize, setBlockSize} from "./tile_map.js"
import {visibility} from "../src/tile_set.js"
import {blockType} from "../src/block.js"

export let currentTile = 1, altTile = 0, currentTileSet, currentBlock

export function renderTileSet() {
    let quantity = 0
    for(const set of Object.values(tileSet)) {
        quantity += set.images.quantity
    }

    let columns = Math.floor(tiles.width)
    let height = Math.ceil(quantity / columns)
    let x0 = distToScreen(0.5 * (tiles.width - columns))
    let y0 = distToScreen(0.5 * (tiles.height - height) - tiles.y)
    let pos = -1

    for(const set of Object.values(tileSet)) {
        let size = distToScreen(1)

        let x, y
        function incrementPos() {
            pos++
            x = x0 + size * (pos % columns)
            y = y0 + size * Math.floor(pos / columns)
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
}