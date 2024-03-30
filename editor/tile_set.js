import {regionSelector} from "./select_region.js"
import {block, select, tiles, tileSetCanvas, toggleVisibility} from "./main.js"
import {tileSet} from "../src/project.js"
import {canvasUnderCursor, ctx, distToScreen, setCanvas} from "../src/canvas.js"
import {drawDashedRect} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"
import {setBlockSize} from "./tile_map.js"
import {type} from "../src/block.js"
import {visibility} from "../src/tile_set.js"

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
        let images = set.images
        let size = distToScreen(1)
        for(let i = 0; i < images.quantity; i++) {
            if(set.visibility[i] !== visibility.visible) continue
            pos++
            let x = x0 + size * (pos % columns)
            let y = y0 + size * Math.floor(pos / columns)
            images.image(i).drawResized(x, y, size, size)
            if(set === currentTileSet && (currentTile === i || altTile === i)) {
                drawDashedRect(x, y, size, size)
            }
            if(canvasUnderCursor !== tiles) continue
            if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {

                currentTile = i
                currentBlock = undefined
                setBlockSize(1, 1)
                currentTileSet = set
            }
        }

        let texture = images.texture
        for(let block of set.blocks) {
            pos++
            let x = x0 + size * (pos % columns)
            let y = y0 + size * Math.floor(pos / columns)
            let cellWidth = texture.width / images.columns
            let cellHeight = texture.height / images.rows
            let tx = block.x * cellWidth
            let ty = block.y * cellHeight
            let tWidth = block.width * cellWidth
            let tHeight = block.height * cellHeight
            ctx.drawImage(texture, tx, ty, tWidth, tHeight, x, y, size, size)

            if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                currentBlock = block
                setBlockSize(block.width, block.height)
                currentTile = -1
                currentTileSet = set
            }

            if(set === currentTileSet && currentBlock === block) {
                drawDashedRect(x, y, size, size)
            }
        }
    }
}

export function updateTileSetProperties() {
    setCanvas(tileSetCanvas)
    tileSetCanvas.update()

    if(regionSelector === undefined) return

    if(toggleVisibility.wasPressed) {
        let hide
        regionSelector.process((tileNum) => {
            let vis = currentTileSet.visibility[tileNum]
            if(vis === visibility.block) return
            if(hide === undefined) hide = vis === visibility.visible ? visibility.hidden : visibility.visible
            currentTileSet.visibility[tileNum] = hide
        })
    }

    if(block.wasPressed) {
        currentTileSet.addRegion(regionSelector, type.block)
    }
}