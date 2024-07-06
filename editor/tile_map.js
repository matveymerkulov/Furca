import {mouse, removeFromArray} from "../src/system.js"
import {tileMap, tileMaps} from "../src/project.js"
import {addTileMap} from "./create_tile_map.js"
import {
    autoTilingEditorKey,
    changeBrushTypeKey,
    copyKey,
    currentMode,
    decrementBrushSizeKey,
    delKey,
    incrementBrushSizeKey,
    mode,
    renameMapKey,
    rulesWindow,
    selectKey,
    tileSetPropertiesKey,
    tileSetWindow,
} from "./main.js"
import {getName, incrementName, setName} from "./names.js"
import {ctx, distToScreen, xToScreen, yToScreen} from "../src/canvas.js"
import {clearSelection, mapSelectionRegion, selectedTileMaps} from "./select_tile_maps.js"
import {altTile, currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {updateNewMapWindow} from "./new_map.js"
import Sprite from "../src/sprite.js"
import {resetRegionSelector} from "./select_tile_set_region.js"
import {showWindow} from "../src/gui/window.js"
import {mapRegion} from "./select_map_region.js"
import {blockType} from "../src/block.js"
import {drawDashedRegion} from "../src/draw.js"
import {enframeTile, updateCategoriesList} from "./auto_tiling.js"

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

    if(currentMode === mode.tiles) {
        if(mapRegion !== undefined && currentTileMap !== undefined) {
            let cellWidth = currentTileMap.cellWidth
            let cellHeight = currentTileMap.cellHeight
            drawDashedRegion(xToScreen(currentTileMap.leftX + mapRegion.x * cellWidth)
                , yToScreen(currentTileMap.topY + mapRegion.y * cellHeight)
                , distToScreen((mapRegion.width + 1) * cellWidth)
                , distToScreen((mapRegion.height + 1) * cellHeight))
        } else if(currentTileSprite !== undefined) {
            currentTileSprite.drawDashedRegion(currentBlock === undefined && brushType === brush.circle)
        }
    } else if(currentMode === mode.maps) {
        if(mapSelectionRegion !== undefined) {
            mapSelectionRegion.drawDashedRegion()
        } else if(selectedTileMaps.length > 0) {
            for(let map of selectedTileMaps) {
                map.drawDashedRegion()
            }
        } else if(tileMapUnderCursor !== undefined) {
            tileMapUnderCursor.drawDashedRegion()
        }
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

    if(currentTileSet === undefined) return

    if(tileSetPropertiesKey.wasPressed) {
        resetRegionSelector()
        showWindow(tileSetWindow)
    }

    if(autoTilingEditorKey.wasPressed) {
        showWindow(rulesWindow)
        updateCategoriesList()
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

export function tileMapOperations() {
    if(renameMapKey.wasPressed) {
        // noinspection JSCheckFunctionSignatures
        let name = prompt("Введите новое название карты:", getName(tileMapUnderCursor))
        if(name !== null) {
            setName(tileMapUnderCursor, name)
        }
    }
}

export let brush = {
    square: Symbol("square"),
    circle: Symbol("circle"),
}
export let brushSize = 2, brushType = brush.square
let tileSprite = new Sprite()
let blockWidth = brushSize, blockHeight = brushSize

export function setBlockSize(width, height) {
    blockWidth = width
    blockHeight = height
}

export function setTiles(column, row, width, height, tileNum, block) {
    if(block !== undefined && block.type === blockType.frame) {
        if(block.width < 3) width = block.width
        if(block.height < 3) height = block.height
    }

    for(let y = 0; y < height; y++) {
        let yy = row + y
        if(yy < 0 || yy >= currentTileMap.rows) continue
        for(let x = 0; x < width; x++) {
            let xx = column + x
            if(xx < 0 || xx >= currentTileMap.columns) continue

            function setTile(dx, dy) {
                currentTileMap.setTile(xx, yy, block.x + dx + currentTileSet.columns * (block.y + dy))
                enframeTile(currentTileMap, currentTileSet, xx, yy)
            }

            if(tileNum !== undefined) {
                if(brushType === brush.circle) {
                    let dx = x - 0.5 * (width - 1)
                    let dy = y - 0.5 * (height - 1)
                    if(Math.sqrt(dx * dx + dy * dy) > 0.5 * width) continue
                }
                currentTileMap.setTile(xx, yy, tileNum)
            } else if(block.type === blockType.block) {
                setTile(x, y)
            } else if(block.type === blockType.frame) {
                let dx = block.width < 3 || x === 0 ? x : (x === blockWidth - 1 ? 2 : 1)
                let dy = block.height < 3 || y === 0 ? y : (y === blockHeight - 1 ? 2 : 1)
                setTile(dx, dy)
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
            setTiles(column, row, blockWidth, blockHeight, currentTile)
        } else if(currentBlock.type === blockType.block) {
            setTiles(column, row, blockWidth, blockHeight, undefined, currentBlock)
        }
    } else if(delKey.isDown) {
        setTiles(column, row, blockWidth, blockHeight, altTile)
    }

    if(changeBrushTypeKey.wasPressed) {
        brushType = brushType === brush.circle ? brush.square : brush.circle
    }

    if(incrementBrushSizeKey.wasPressed) {
        brushSize++
        if(currentBlock === undefined) setBlockSize(brushSize, brushSize)
    } else if(decrementBrushSizeKey.wasPressed && brushSize > 1) {
        brushSize--
        if(currentBlock === undefined) setBlockSize(brushSize, brushSize)
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