import {ctx, setCanvas} from "../src/canvas.js"
import {regionSelector, setTileWidth, tileHeight, tileWidth} from "./select_region.js"
import {drawDashedRect, drawRect} from "../src/draw.js"
import {canvasMouse} from "../src/system.js"
import {currentTileSet} from "./main.js"
import {drawX} from "./draw.js"
import {type} from "../src/tile_set.js"

export function renderTileSetProperties(canvas) {
    if(currentTileSet === undefined) return

    let images = currentTileSet.images
    let tex = images.texture
    let scale = Math.min((document.body.offsetWidth - 100) / tex.width
        , (document.body.offsetHeight - 100) / tex.height, 2)
    let style = canvas.node.style
    let canvasWidth = tex.width * scale
    let canvasHeight = tex.height * scale
    style.width = canvasWidth + "px"
    style.height = canvasHeight + "px"

    setCanvas(canvas)
    ctx.canvas.width = canvasWidth
    ctx.canvas.height = canvasHeight
    ctx.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, canvasWidth, canvasHeight)

    setTileWidth(canvasWidth / images.columns, canvasHeight / images.rows)

    drawDashedRect(Math.floor(canvasMouse.x / tileWidth) * tileWidth + 3
        , Math.floor(canvasMouse.y / tileHeight) * tileHeight + 3, tileWidth - 7, tileHeight - 7)

    let cellWidth = canvasWidth / currentTileSet.columns
    let cellHeight = canvasHeight / currentTileSet.rows

    for(let y = 0; y < currentTileSet.rows; y++) {
        for(let x = 0; x < currentTileSet.columns; x++) {
            let n = x + y * currentTileSet.columns
            if(currentTileSet.hidden[n] === false) continue
            let xx = (x + 0.5) * cellWidth
            let yy = (y + 0.5) * cellHeight
            drawX(xx, yy, 3, 5, "black")
            drawX(xx, yy, 1, 5, "white")
        }
    }

    for(let block of currentTileSet.blocks) {
        let color
        switch(block.type) {
            case type.block:
                color = "lightgreen"
                break
        }
        drawRect(color, block.x * tileWidth + 2, block.y * tileHeight + 2
            , (block.width + 1) * tileWidth - 5, (block.height + 1) * tileHeight - 5)
    }

    if(regionSelector === undefined) return
    drawDashedRect(regionSelector.x * tileWidth, regionSelector.y * tileHeight
        , (regionSelector.width + 1) * tileWidth - 1, (regionSelector.height + 1) * tileHeight - 1)
}