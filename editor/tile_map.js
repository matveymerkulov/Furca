import {mouse, removeFromArray} from "../src/system.js"
import {tileMap, tileMaps} from "../src/project.js"
import {addTileMap} from "./create_tile_map.js"
import {copy, currentMode, del, mode, renameMap, select, turnMap,} from "./main.js"
import {getName, incrementName, setName} from "./names.js"
import {ctx, xToScreen, yToScreen} from "../src/canvas.js"
import {clearSelection, selected, selector} from "./select.js"
import {drawCross} from "./draw.js"
import {altTile, currentTile, currentTileSet} from "./tile_set.js"

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

export function mapWindowOperations() {
   if(del.wasPressed && selected.length > 0) {
        for(let map of selected) {
            removeFromArray(map, tileMaps.items)
            delete tileMap[getName(map)]
        }
        clearSelection()
    }
}

export let currentTileMap, tileMapUnderCursor, currentTileSprite, currentBlock

export function checkCollisions() {
    currentTileMap = undefined
    tileMapUnderCursor = undefined
    currentTileSprite = undefined
    currentBlock = undefined

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

export function tileModeOperations() {
    let tile = currentTileMap.tileForPoint(mouse)
    if(tile >= 0) {
        if(select.isDown) {
            currentTileMap.setTile(tile, currentTile)
        } else if(del.isDown) {
            currentTileMap.setTile(tile, altTile)
        }
        currentTileSprite = currentTileMap.tileSprite(tile)
    }
}

export function mapsModeOperations() {
    if(del.wasPressed && selected.length === 0) {
        removeFromArray(tileMapUnderCursor, tileMaps.items)
        delete tileMap[getName(tileMapUnderCursor)]
    }
}