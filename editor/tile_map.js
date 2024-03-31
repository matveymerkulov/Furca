import {mouse, removeFromArray} from "../src/system.js"
import {tileMap, tileMaps} from "../src/project.js"
import {addTileMap} from "./create_tile_map.js"
import {copyKey, currentMode, delKey, mode, renameMapKey, selectKey, tileHeight, tileSetPropertiesKey, tileSetWindow, tileWidth, turnMapKey,} from "./main.js"
import {getName, incrementName, setName} from "./names.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "../src/canvas.js"
import {clearSelection, selectedTileMaps, mapSelectionRegion} from "./select_tile_maps.js"
import {drawCross} from "./draw.js"
import {altTile, currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {updateNewMapWindow} from "./new_map.js"
import Sprite from "../src/sprite.js"
import {resetRegionSelector, tileSetRegion} from "./select_tile_set_region.js"
import {showWindow} from "../src/gui/window.js"
import {frameRegion} from "./select_frame_region.js"
import {blockType} from "../src/block.js"
import {drawDashedRect} from "../src/draw.js"

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
            if(frameRegion !== undefined && currentTileMap !== undefined) {
                let cellWidth = currentTileMap.cellWidth
                let cellHeight = currentTileMap.cellHeight
                drawDashedRect(xToScreen(currentTileMap.leftX + frameRegion.x * cellWidth)
                    , yToScreen(currentTileMap.topY + frameRegion.y * cellHeight)
                    , distToScreen((frameRegion.width + 1) * cellWidth)
                    , distToScreen((frameRegion.height + 1) * cellHeight))
            } else if(currentTileSprite !== undefined) {
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
            if(mapSelectionRegion !== undefined) {
                mapSelectionRegion.drawDashedRect()
            } else if(selectedTileMaps.length > 0) {
                for(let map of selectedTileMaps) {
                    map.drawDashedRect()
                }
            } else if(tileMapUnderCursor !== undefined) {
                tileMapUnderCursor.drawDashedRect()
            }
            break
    }
}

export function mainWindowOperations() {
   if(delKey.wasPressed && selectedTileMaps.length > 0) {
        for(let map of selectedTileMaps) {
            removeFromArray(map, tileMaps.items)
            delete tileMap[getName(map)]
        }
        clearSelection()
    }

    updateNewMapWindow()

    if(tileSetPropertiesKey.wasPressed && currentTileSet !== undefined) {
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

    if(turnMapKey.wasPressed) {
        tileMapUnderCursor.turnClockwise(centerX, centerY)
    }

    if(renameMapKey.wasPressed) {
        // noinspection JSCheckFunctionSignatures
        let name = prompt("Enter new name of tile map:", getName(tileMapUnderCursor))
        if(name !== null) {
            setName(tileMapUnderCursor, name)
        }
    }
}

let tileSprite = new Sprite()
let blockWidth = 4, blockHeight = 3

export function setBlockSize(width, height) {
    blockWidth = width
    blockHeight = height
}

export function setTiles(column, row, tileNum, block) {
    if(block !== undefined && block.type === blockType.frame) {
        if(block.width < 3) blockWidth = block.width
        if(block.height < 3) blockHeight = block.height
    }

    for(let y = 0; y < blockHeight; y++) {
        let yy = row + y
        if(yy < 0 || yy >= currentTileMap.rows) continue
        for(let x = 0; x < blockWidth; x++) {
            let xx = column + x
            if(xx < 0 || xx >= currentTileMap.columns) continue
            if(block === undefined) {
                currentTileMap.setTile(xx, yy, tileNum)
            } else if(block.type === blockType.block) {
                currentTileMap.setTile(xx, yy, block.x + x + currentTileSet.columns * (block.y + y))
            } else if(block.type === blockType.frame) {
                let dx = block.width < 3 || x === 0 ? x : (x === blockWidth - 1 ? 2 : 1)
                let dy = block.height < 3 || y === 0 ? y : (y === blockHeight - 1 ? 2 : 1)
                currentTileMap.setTile(xx, yy, block.x + dx + currentTileSet.columns * (block.y + dy))
            }
        }
    }
}

export function tileModeOperations() {
    let brushWidth = currentTileMap.cellWidth * blockWidth
    let brushHeight = currentTileMap.cellWidth * blockHeight
    let column = Math.floor(currentTileMap.fColumn(mouse) - 0.5 * (brushWidth - 1))
    let row = Math.floor(currentTileMap.fRow(mouse) - 0.5 * (brushHeight - 1))

    if(selectKey.isDown) {
        if(currentBlock === undefined) {
            setTiles(column, row, currentTile)
        } else if(currentBlock.type === blockType.block) {
            setTiles(column, row, 0, currentBlock)
        }
    } else if(delKey.isDown) {
        setTiles(column, row, altTile)
    }

    let x = currentTileMap.leftX + currentTileMap.cellWidth * column + 0.5 * brushWidth
    let y = currentTileMap.topY + currentTileMap.cellHeight * row + 0.5 * brushHeight
    tileSprite.setPosition(x, y)
    tileSprite.setSize(brushWidth, brushHeight)
    currentTileSprite = tileSprite
}

export function mapModeOperations() {
    if(copyKey.wasPressed) {
        addTileMap(incrementName(getName(tileMapUnderCursor)), tileMapUnderCursor.copy())
    }

    if(delKey.wasPressed && selectedTileMaps.length === 0) {
        removeFromArray(tileMapUnderCursor, tileMaps.items)
        delete tileMap[getName(tileMapUnderCursor)]
    }
}