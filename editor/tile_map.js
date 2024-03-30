import {mouse, removeFromArray} from "../src/system.js"
import {tileMap, tileMaps} from "../src/project.js"
import {addTileMap} from "./create_tile_map.js"
import {copy, currentMode, del, mode, renameMap, select, tileSetProperties, tileSetWindow, turnMap,} from "./main.js"
import {getName, incrementName, setName} from "./names.js"
import {ctx, xToScreen, yToScreen} from "../src/canvas.js"
import {clearSelection, selected, selector} from "./select.js"
import {drawCross} from "./draw.js"
import {altTile, currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {updateNewMapWindow} from "./new_map.js"
import Sprite from "../src/sprite.js"
import {resetRegionSelector} from "./select_region.js"
import {showWindow} from "../src/gui/window.js"

export let currentTileMap, tileMapUnderCursor, currentTileSprite

export function renderMaps() {
    tileMaps.items.forEach(map => {
        map.draw()
        let name = getName(map)
        ctx.fillStyle = "white"
        ctx.font = "16px serif"
        // noinspection JSCheckFunctionSignatures
        let metrics = ctx.measureText(name)
        // noinspection JSCheckFunctionSignatures
        ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
            , yToScreen(map.topY) - 0.5 * metrics.actualBoundingBoxDescent - 4)
    })

    switch(currentMode) {
        case mode.tiles:
            if(currentTileSprite !== undefined) {
                currentTileSprite.drawDashedRect()
            }

            if(tileMapUnderCursor !== undefined) {
                let x = tileMapUnderCursor.leftX + centerX
                let y = tileMapUnderCursor.topY + centerY
                drawCross(x, y, 2, "black")
                drawCross(x, y, 1, "white")
            }
            break
        case mode.maps:
            if(selector !== undefined) {
                selector.drawDashedRect()
            } else if(selected.length > 0) {
                for(let map of selected) {
                    map.drawDashedRect()
                }
            } else if(tileMapUnderCursor !== undefined) {
                tileMapUnderCursor.drawDashedRect()
            }
            break
    }
}

export function mainWindowOperations() {
   if(del.wasPressed && selected.length > 0) {
        for(let map of selected) {
            removeFromArray(map, tileMaps.items)
            delete tileMap[getName(map)]
        }
        clearSelection()
    }

    updateNewMapWindow()

    if(tileSetProperties.wasPressed && currentTileSet !== undefined) {
        resetRegionSelector()
        showWindow(tileSetWindow)
    }
}

export function checkMapsWindowCollisions() {
    currentTileMap = undefined
    tileMapUnderCursor = undefined
    currentTileSprite = undefined

    tileMaps.collisionWithPoint(mouse.x, mouse.y, (x, y, map) => {
        tileMapUnderCursor = map
        if(currentTileSet === map.tileSet || currentMode === mode.maps) {
            currentTileMap = map
        }
    })

    if(currentTileMap !== undefined) {
        tileMapUnderCursor = currentTileMap
    }
}

export let centerX, centerY

export function tileMapOperations() {
    let x0 = tileMapUnderCursor.fColumn(mouse)
    let y0 = tileMapUnderCursor.fRow(mouse)
    let x1 = Math.floor(x0) + 0.5
    let y1 = Math.floor(y0) + 0.5
    if(Math.abs(x0 - x1) + Math.abs(y0 - y1) <= 0.5) {
        centerX = x1
        centerY = y1
    } else {
        centerX = Math.round(x0)
        centerY = Math.round(y0)
    }

    if(turnMap.wasPressed) {
        tileMapUnderCursor.turnClockwise(centerX, centerY)
    }

    if(renameMap.wasPressed) {
        // noinspection JSCheckFunctionSignatures
        let name = prompt("Enter new name of tile map:", getName(tileMapUnderCursor))
        if(name !== null) {
            setName(tileMapUnderCursor, name)
        }
    }

    if(copy.wasPressed) {
        addTileMap(incrementName(getName(tileMapUnderCursor)), tileMapUnderCursor.copy())
    }

    if(del.wasPressed && selected.length === 0) {
        removeFromArray(tileMapUnderCursor, tileMaps.items)
        delete tileMap[getName(tileMapUnderCursor)]
    }
}

let tileSprite = new Sprite()
let blockWidth = 4, blockHeight = 3

export function setBlockSize(width, height) {
    blockWidth = width
    blockHeight = height
}

function setTiles(column, row, tileNum, block) {
    for(let y = 0; y < blockHeight; y++) {
        let yy = row + y
        if(yy < 0 || yy > currentTileMap.rows) continue
        for(let x = 0; x < blockWidth; x++) {
            let xx = column + x
            if(xx < 0 || xx > currentTileMap.columns) continue
            if(block === undefined) {
                currentTileMap.setTile(xx, yy, tileNum)
            } else {
                currentTileMap.setTile(xx, yy, block.x + x + currentTileSet.columns * (block.y + y))
            }
        }
    }
}

export function tileModeOperations() {
    let brushWidth = currentTileMap.cellWidth * blockWidth
    let brushHeight = currentTileMap.cellWidth * blockHeight
    let column = Math.floor(currentTileMap.fColumn(mouse) - 0.5 * (brushWidth - 1))
    let row = Math.floor(currentTileMap.fRow(mouse) - 0.5 * (brushHeight - 1))

    if(select.isDown) {
        if(currentBlock === undefined) {
            setTiles(column, row, currentTile)
        } else {
            setTiles(column, row, 0, currentBlock)
        }
    } else if(del.isDown) {
        setTiles(column, row, altTile)
    }

    let x = currentTileMap.leftX + currentTileMap.cellWidth * column + 0.5 * brushWidth
    let y = currentTileMap.topY + currentTileMap.cellHeight * row + 0.5 * brushHeight
    tileSprite.setPosition(x, y)
    tileSprite.setSize(brushWidth, brushHeight)
    currentTileSprite = tileSprite
}

export function mapModeOperations() {
    if(del.wasPressed && selected.length === 0) {
        removeFromArray(tileMapUnderCursor, tileMaps.items)
        delete tileMap[getName(tileMapUnderCursor)]
    }
}