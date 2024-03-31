import {ctx, setCanvas} from "../src/canvas.js"
import {tileSetRegion} from "./select_tile_set_region.js"
import {drawDashedRect, drawRect} from "../src/draw.js"
import {canvasMouse} from "../src/system.js"
import {drawX} from "./draw.js"
import {currentTileSet} from "./tile_set.js"
import {blockType} from "../src/block.js"
import {visibility} from "../src/tile_set.js"
import {delKey, newBlockKey, newFrameKey, setTileWidth, tileHeight, tileSetCanvas, tileWidth
    , toggleVisibilityKey} from "./main.js"

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
            if(currentTileSet.visibility[n] !== visibility.hidden) continue
            let xx = (x + 0.5) * cellWidth
            let yy = (y + 0.5) * cellHeight
            drawX(xx, yy, 3, 5, "black")
            drawX(xx, yy, 1, 5, "white")
        }
    }

    for(let block of currentTileSet.blocks) {
        let innerColor, outerColor
        switch(block.type) {
            case blockType.block:
                innerColor = "green"
                outerColor = "lightgreen"
                break
            case blockType.frame:
                innerColor = "lightred"
                outerColor = "red"
                break
        }
        drawRect(innerColor, outerColor,block.x * tileWidth + 2, block.y * tileHeight + 2
            , block.width * tileWidth - 4, block.height * tileHeight - 4)
    }

    if(tileSetRegion === undefined) return
    drawDashedRect(tileSetRegion.x * tileWidth, tileSetRegion.y * tileHeight
        , (tileSetRegion.width + 1) * tileWidth, (tileSetRegion.height + 1) * tileHeight)
}

export function updateTileSetProperties() {
    setCanvas(tileSetCanvas)
    tileSetCanvas.update()

    if(delKey.wasPressed) {
        currentTileSet.removeBlock(Math.floor(canvasMouse.x / tileWidth), Math.floor(canvasMouse.y / tileHeight))
    }

    if(tileSetRegion === undefined) return

    if(toggleVisibilityKey.wasPressed) {
        let hide
        tileSetRegion.process((tileNum) => {
            let vis = currentTileSet.visibility[tileNum]
            if(vis === visibility.block) return
            if(hide === undefined) hide = vis === visibility.visible ? visibility.hidden : visibility.visible
            currentTileSet.visibility[tileNum] = hide
        })
    }

    if(newBlockKey.wasPressed) {
        currentTileSet.addRegion(tileSetRegion, blockType.block)
    } else if(newFrameKey.wasPressed) {
        currentTileSet.addRegion(tileSetRegion, blockType.frame)
    }
}