import {tileSet} from "../src/project.js"
import {canvasUnderCursor, distToScreen} from "../src/canvas.js"
import {drawDashedRect} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {canvasMouse} from "../src/system.js"
import {altTile, currentTile, currentTileSet, setCurrentTile, tiles} from "./main.js"
import {visibility} from "../src/tile_set.js"

export function renderTileSet(select) {
    let quantity = 0
    for(const set of Object.values(tileSet)) {
        quantity += set.images.quantity
    }

    let start = 0
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
                setCurrentTile(set, i)
            }
        }
    }
}