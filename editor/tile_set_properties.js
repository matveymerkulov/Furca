import Canvas, {canvasUnderCursor, ctx, currentCanvas, setCanvas} from "../src/canvas.js"
import SelectTileSetRegion, {tileSetRegion} from "./select_tile_set_region.js"
import {drawDashedRegion, drawRect} from "../src/draw.js"
import {canvasMouse, element} from "../src/system.js"
import {drawX} from "./draw.js"
import {currentTileSet} from "./tile_set.js"
import {blockType} from "../src/block.js"
import {visibility} from "../src/tile_set.js"
import {
    setTileSize,
    tileHeight,
    tileWidth,
} from "./main.js"
import {Win} from "../src/gui/window.js"
import Key from "../src/key.js"

let selectKey = new Key("LMB")
let delKey = new Key("Delete")
let toggleVisibilityKey = new Key("KeyV")
let newBlockKey = new Key("KeyB")
let newFrameKey = new Key("KeyF")

export let tileSetPropertiesWindow = new Win("tile_set_window")

let blocksCanvas = tileSetPropertiesWindow.addCanvas("tile_set_blocks", 9, 16)
blocksCanvas.add(new SelectTileSetRegion(), selectKey)


export function renderTileSetCanvas() {
    let images = currentTileSet.images
    let tex = images.texture
    let scale = Math.min((document.body.offsetWidth - 100) / tex.width
        , (document.body.offsetHeight - 100) / tex.height, 2)
    let style = currentCanvas.node.style
    let canvasWidth = tex.width * scale
    let canvasHeight = tex.height * scale
    style.width = canvasWidth + "px"
    style.height = canvasHeight + "px"

    ctx.canvas.width = canvasWidth
    ctx.canvas.height = canvasHeight
    ctx.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, canvasWidth, canvasHeight)

    setTileSize(canvasWidth / images.columns, canvasHeight / images.rows)

    if(canvasUnderCursor !== currentCanvas) return

    drawDashedRegion(Math.floor(canvasMouse.x / tileWidth) * tileWidth + 3
        , Math.floor(canvasMouse.y / tileHeight) * tileHeight + 3, tileWidth - 7, tileHeight - 7)
}



blocksCanvas.render = () => {
    renderTileSetCanvas()

    for(let y = 0; y < currentTileSet.rows; y++) {
        for(let x = 0; x < currentTileSet.columns; x++) {
            let n = x + y * currentTileSet.columns
            if(currentTileSet.visibility[n] !== visibility.hidden) continue
            let xx = (x + 0.5) * tileWidth
            let yy = (y + 0.5) * tileHeight
            drawX(xx, yy, 5, 6, "black")
            drawX(xx, yy, 3, 5, "white")
        }
    }

    for(let block of currentTileSet.blocks) {
        let innerColor, outerColor
        if(block.type === blockType.block) {
            innerColor = "lightgreen"
            outerColor = "green"
        } else if(block.type === blockType.frame) {
            innerColor = "red"
            outerColor = "darkred"
        }
        drawRect(innerColor, outerColor,block.x * tileWidth + 2, block.y * tileHeight + 2
            , block.width * tileWidth - 4, block.height * tileHeight - 4)
    }

    if(tileSetRegion === undefined) return
    drawDashedRegion(tileSetRegion.x * tileWidth, tileSetRegion.y * tileHeight
        , (tileSetRegion.width + 1) * tileWidth, (tileSetRegion.height + 1) * tileHeight)
}


blocksCanvas.update = () => {
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