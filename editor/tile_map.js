import {mouse} from "../src/system.js"
import {tileMap, tileMaps} from "../src/project.js"
import {addTileMap} from "./create_tile_map.js"
import {getName, incrementName, setName} from "../src/names.js"
import {canvasUnderCursor, ctx, distToScreen, setCanvas, xToScreen, yToScreen} from "../src/canvas.js"
import SelectTileMaps, {clearSelection, mapSelectionRegion, selectedTileMaps} from "./select_tile_maps.js"
import {altGroup, currentBlock, currentGroup, currentTile, currentTileSet, updateBlockSize} from "./tile_set.js"
import {newMap} from "./new_map.js"
import {Sprite} from "../src/sprite.js"
import SelectMapRegion, {mapRegion, regionTileMap} from "./select_map_region.js"
import {blockType} from "../src/block.js"
import {drawDashedRegion} from "../src/draw.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import MoveTileMaps from "./move_tile_maps.js"
import {Key} from "../src/key.js"
import {enframeTile} from "../src/auto_tiling.js"
import {mainWindow} from "./main_window.js"
import {removeFromArray, rndi} from "../src/functions.js"

export let currentTileMap, tileMapUnderCursor, currentTileSprite

export const mode = {
    tiles: Symbol("tiles"),
    maps: Symbol("maps"),
}

export let currentMode = mode.tiles

let switchModeKey = new Key("Space")

let selectKey = new Key("LMB")
let delKey = new Key("Delete")
let panKey = new Key("ControlLeft", "MMB")
let zoomInKey = new Key("WheelUp")
let zoomOutKey = new Key("WheelDown")

let newMapKey = new Key("KeyN")
let renameMapKey = new Key("KeyR")
let copyMapKey = new Key("KeyC")
let deleteMapKey = new Key("Delete")

let changeBrushTypeKey = new Key("KeyB")
let incrementBrushSizeKey = new Key("NumpadAdd")
let decrementBrushSizeKey = new Key("NumpadSubtract")
let rectangleModeKey = new Key("KeyR")


let mapsCanvas = mainWindow.addCanvas("map", 30, 14)
mapsCanvas.background = "rgb(9, 44, 84)"
mapsCanvas.setZoom(-19)
mapsCanvas.add(new Pan(), panKey)
mapsCanvas.add(new Zoom(zoomInKey, zoomOutKey))
mapsCanvas.add(new SelectTileMaps(), selectKey)
mapsCanvas.add(new MoveTileMaps(), selectKey)
mapsCanvas.add(new SelectMapRegion(), selectKey)


mapsCanvas.render = () => {
    tileMaps.items.forEach(map => {
        map.draw()
        let name = getName(map)
        ctx.fillStyle = "white"
        ctx.font = "16px serif"
        // noinspection JSCheckFunctionSignatures
        let metrics = ctx.measureText(name)
        // noinspection JSCheckFunctionSignatures
        ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
            , yToScreen(map.top) - 0.5 * metrics.actualBoundingBoxDescent - 4)
    })

    if(currentMode === mode.tiles) {
        if(mapRegion !== undefined && regionTileMap !== undefined) {
            let cellWidth = regionTileMap.cellWidth
            let cellHeight = regionTileMap.cellHeight
            drawDashedRegion(xToScreen(regionTileMap.left + mapRegion.x * cellWidth)
                , yToScreen(regionTileMap.top + mapRegion.y * cellHeight)
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


mapsCanvas.update = () => {
    if(switchModeKey.wasPressed) {
        currentMode = currentMode === mode.tiles ? mode.maps : mode.tiles
    }

    if(rectangleModeKey.wasPressed) {
        rectangleMode = !rectangleMode
        updateBlockSize(currentBlock)
    }

    if(newMapKey.wasPressed) {
        newMap()
    }

    if(canvasUnderCursor !== mapsCanvas) return

    setCanvas(mapsCanvas)

    checkMapsWindowCollisions()

    if(tileMapUnderCursor === undefined || currentTileMap === undefined) return

    if(currentMode === mode.tiles) {
        tileModeOperations()
    } else if(currentMode === mode.maps) {
        mapModeOperations()
    }
}


let startTileColumn, startTileRow
export let rectangleMode = false

export let brush = {
    square: Symbol("square"),
    circle: Symbol("circle"),
}

export let brushSize = 1, brushType = brush.square
let tileSprite = new Sprite()
let blockWidth = brushSize, blockHeight = brushSize

export function setBlockSize(width, height) {
    blockWidth = width
    blockHeight = height
}


export function tileModeOperations() {
    let brushWidth = currentTileMap.cellWidth * blockWidth
    let brushHeight = currentTileMap.cellWidth * blockHeight
    let column = Math.floor(currentTileMap.tileColumnByPoint(mouse) - 0.5 * (brushWidth - 1))
    let row = Math.floor(currentTileMap.tileRowByPoint(mouse) - 0.5 * (brushHeight - 1))

    if(selectKey.wasPressed) {
        startTileColumn = column
        startTileRow = row
    }

    if(selectKey.isDown) {
        if(!rectangleMode) {
            if(currentBlock === undefined) {
                setTiles(currentTileMap, currentTileSet, column, row, blockWidth, blockHeight, currentTile
                    , undefined, currentGroup)
            } else if(currentBlock.type === blockType.block) {
                column = Math.floor((column - startTileColumn) / blockWidth) * blockWidth + startTileColumn
                row = Math.floor((row - startTileRow) / blockHeight) * blockHeight + startTileRow
                setTiles(currentTileMap, currentTileSet, column, row, blockWidth, blockHeight, undefined
                    , currentBlock)
            }
        }
    } else if(delKey.isDown) {
        setTiles(currentTileMap, currentTileSet, column, row, blockWidth, blockHeight, currentTileSet.altTile
            , undefined, altGroup)
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

    let x = currentTileMap.left + currentTileMap.cellWidth * column + 0.5 * brushWidth
    let y = currentTileMap.top + currentTileMap.cellHeight * row + 0.5 * brushHeight
    tileSprite.setPosition(x, y)
    tileSprite.setSize(brushWidth, brushHeight)
    currentTileSprite = tileSprite
}


export function mapModeOperations() {
    if(renameMapKey.wasPressed) {
        // noinspection JSCheckFunctionSignatures
        let name = prompt("Введите новое название карты:", getName(tileMapUnderCursor))
        if(name !== null) {
            setName(tileMapUnderCursor, name)
        }
    }

    if(copyMapKey.wasPressed) {
        addTileMap(incrementName(getName(tileMapUnderCursor)), tileMapUnderCursor.copy(1 + tileMapUnderCursor.width, 0))
    }

    if(deleteMapKey.wasPressed) {
        if(selectedTileMaps.length === 0) {
            removeFromArray(tileMapUnderCursor, tileMaps.items)
            delete tileMap[getName(tileMapUnderCursor)]
        } else {
            for(let map of selectedTileMaps) {
                removeFromArray(map, tileMaps.items)
                delete tileMap[getName(map)]
            }
            clearSelection()
        }
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


export function setTiles(map, set, column, row, width, height, tileNum, block, group) {
    if(block !== undefined && block.type === blockType.frame) {
        if(block.width < 3) width = block.width
        if(block.height < 3) height = block.height
    }

    for(let y = 0; y < height; y++) {
        let yy = row + y
        if(yy < 0 || yy >= map.rows) continue
        for(let x = 0; x < width; x++) {
            let xx = column + x
            if(xx < 0 || xx >= map.columns) continue

            if(tileNum !== undefined) {
                if(brushType === brush.circle) {
                    let dx = x - 0.5 * (width - 1)
                    let dy = y - 0.5 * (height - 1)
                    if(Math.sqrt(dx * dx + dy * dy) > 0.5 * width) continue
                }
                map.setTileByPos(xx, yy, group === undefined ? tileNum : group[rndi(0, group.length)])
            } else if(block.type === blockType.block) {
                map.setTileByPos(xx, yy, block.x + (x % block.width)
                    + set.columns * (block.y + (y % block.height)))
            } else if(block.type === blockType.frame) {
                let dx = block.width < 3 || x === 0 ? x : (x === blockWidth - 1 ? 2 : 1)
                let dy = block.height < 3 || y === 0 ? y : (y === blockHeight - 1 ? 2 : 1)
                map.setTileByPos(xx, yy, block.x + dx + set.columns * (block.y + dy))
            }
        }
    }

    for(let y = -1; y <= height; y++) {
        let yy = row + y
        if(yy < 0 || yy >= map.rows) continue
        for(let x = -1; x <= width; x++) {
            let xx = column + x
            if(xx < 0 || xx >= map.columns) continue
            enframeTile(map, xx, yy)
        }
    }
}