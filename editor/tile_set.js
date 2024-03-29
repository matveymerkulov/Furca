import {regionSelector} from "./select_region.js"
import {type, visibility} from "../src/tile_set.js"
import {block, tiles, tileSetCanvas, toggleVisibility} from "./main.js"
import {tileSet} from "../src/project.js"
import {canvasUnderCursor, distToScreen, setCanvas} from "../src/canvas.js"
import {drawDashedRect} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"

export let currentTile = 1, altTile = 0, currentTileSet

export function renderTileSet(select) {
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
                currentTileSet = set
            }
        }

        /*for(let block of tileSet.blocks) {
            pos++
            let x = x0 + size * (pos % columns)
            let y = y0 + size * Math.floor(pos / columns)

        }*/
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