import {canvasMouse, mouse} from "../src/system.js"
import {layer, tileMap, world} from "../src/project.js"
import {addObject} from "./create_tile_map.js"
import {getName, incrementName, setName} from "../src/names.js"
import {canvasUnderCursor, ctx, distToScreen, setCanvas, xToScreen, yToScreen} from "../src/canvas.js"
import {SelectTileMaps, clearSelection, mapSelectionRegion, selectedObjects} from "./select_tile_maps.js"
import {
    altGroup,
    currentBlock,
    currentGroup,
    currentTile,
    currentTileSet,
    setCurrentTile,
    updateBlockSize
} from "./tile_set.js"
import {newMap} from "./new_map.js"
import {Sprite} from "../src/sprite.js"
import {SelectMapRegion, mapRegion, regionTileMap} from "./select_map_region.js"
import {blockType} from "../src/block.js"
import {drawDashedRegion} from "../src/draw.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import MoveTileMaps from "./move_tile_maps.js"
import {enframeTile} from "../src/auto_tiling.js"
import {mainWindow} from "./main_window.js"
import {abs, dist, rad, removeFromArray, rndi} from "../src/functions.js"
import {
    cancelKey,
    changeBrushTypeKey,
    copyObjectKey,
    decrementBrushSizeKey,
    deleteObjectKey,
    delKey, groupKey,
    incrementBrushSizeKey, newLinkKey,
    newMapKey, newPivotKey,
    panKey,
    pipetteKey,
    rectangleModeKey,
    renameObjectKey,
    selectKey,
    switchModeKey, ungroupKey,
    zoomInKey,
    zoomOutKey
} from "./keys.js"
import {emptyTile} from "../src/tile_map.js"
import {enterString} from "./input.js"
import {Layer} from "../src/layer.js"
import {drawArrow, drawCross, drawEllipse} from "./draw.js"
import {Point} from "../src/point.js"
import {circleWithParamPointCollision} from "../src/collisions.js"
import {Pivot} from "../src/pivot.js"
import {settings} from "./settings.js"

export let currentTileMap, objectUnderCursor, currentTileSprite, selectedPivot

export const mode = {
    tiles: Symbol("tiles"),
    maps: Symbol("maps"),
}

export let currentMode = mode.maps

export let mapsCanvas = mainWindow.addCanvas("map", 30, 14)
mapsCanvas.background = "rgb(9, 44, 84)"
mapsCanvas.setZoom(-19)
mapsCanvas.add(new Pan(), panKey)
mapsCanvas.add(new Zoom(zoomInKey, zoomOutKey))
mapsCanvas.add(new SelectTileMaps(), selectKey)
mapsCanvas.add(new MoveTileMaps(), selectKey)
mapsCanvas.add(new SelectMapRegion(), selectKey)


export function drawPivotArrow(x1, y1, x2, y2) {
    const pivotSettings = settings.pivot
    const arrowSettings = pivotSettings.arrow
    drawArrow(x1, y1, x2, y2, arrowSettings.width, arrowSettings.angle, arrowSettings.length, "white")
}

mapsCanvas.render = () => {

    for(let object of world.items) {
        object.draw()
        if(object instanceof Pivot) {
            const x = xToScreen(object.x)
            const y = yToScreen(object.y)
            drawEllipse(x - 4, y - 4, 8, 8, "black")
            drawEllipse(x - 2, y - 2, 4, 4, "white")
            if(selectedObjects.includes(object) || objectUnderCursor === object) {
                drawDashedRegion(x - 6, y - 6, 12, 12, true)
            }

            for(const bone of object.bones) {
                if(bone.pivot1 !== object) continue
                drawPivotArrow(xToScreen(bone.pivot1.x), yToScreen(bone.pivot1.y)
                    , xToScreen(bone.pivot2.x), yToScreen(bone.pivot2.y))
            }
        }
        let name = getName(object)
        ctx.fillStyle = "white"
        ctx.font = `${distToScreen(1)}px serif`
        // noinspection JSCheckFunctionSignatures
        let metrics = ctx.measureText(name)
        // noinspection JSCheckFunctionSignatures
        if(object instanceof Layer) object = object.items[0]
        ctx.fillText(name, xToScreen(object.x) - 0.5 * metrics.width
            , yToScreen(object.top) - 0.5 * metrics.actualBoundingBoxDescent - 4)
    }

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
        } else if(selectedObjects.length > 0) {
            for(let map of selectedObjects) {
                map.drawDashedRegion()
            }
        } else if(objectUnderCursor !== undefined) {
            objectUnderCursor.drawDashedRegion()
        }

        if(selectedPivot !== undefined) {
            drawPivotArrow(xToScreen(selectedPivot.x), yToScreen(selectedPivot.y), canvasMouse.x, canvasMouse.y)
        }
    }
}


mapsCanvas.update = () => {
    if(switchModeKey.wasPressed) {
        currentMode = currentMode === mode.tiles ? mode.maps : mode.tiles
    }

    if(canvasUnderCursor !== mapsCanvas) return

    setCanvas(mapsCanvas)

    checkObjectsWindowCollisions()

    if(currentMode === mode.tiles) {
        if(rectangleModeKey.wasPressed) {
            rectangleMode = !rectangleMode
            updateBlockSize(currentBlock)
        }

        if(currentTileMap === undefined) return
        tileModeOperations()
    } else if(currentMode === mode.maps) {
        if(newMapKey.wasPressed) {
            newMap()
        }

        if(newPivotKey.wasPressed) {
            world.add(new Pivot(mouse.x, mouse.y))
        }

        if(cancelKey.wasPressed) {
            selectedPivot = undefined
        }

        if(selectedObjects.length === 0 && objectUnderCursor === undefined) return
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

    if(pipetteKey.wasPressed && currentTileSet !== undefined) {
        const tile = currentTileMap.tileByPos(column, row)
        if(tile !== emptyTile) setCurrentTile(tile)
    }
}


export function mapModeOperations() {
    const objects = selectedObjects.length > 0 ? selectedObjects : [objectUnderCursor]
    const firstObject = objects[0]

    if(objectUnderCursor instanceof Pivot) {
        if(newLinkKey.wasPressed) {
           selectedPivot = objectUnderCursor
        }

        if(selectedPivot !== undefined && selectedPivot !== objectUnderCursor) {
            if(selectKey.wasPressed) {
                selectedPivot.addBone(objectUnderCursor)
                selectedPivot = undefined
            }
        }
    }

    if(renameObjectKey.wasPressed) {
        // noinspection JSCheckFunctionSignatures
        if(objects.length === 1) {
            enterString("Введите новое название объекта:", getName(firstObject), (name) => {
                setName(firstObject, name)
            })
        } else {
            enterString("Введите постфикс объектов:", "", (postfix) => {
                for(let object of objects) {
                    setName(object, getName(object) + postfix)
                }
            })
        }
    }

    if(copyObjectKey.wasPressed) {
        const width = firstObject instanceof Layer ? firstObject.items[0].width : firstObject.width
        for(let object of objects) {
            addObject(incrementName(getName(object)), object.copy(1 + width, 0))
        }
    }

    function removeObjects() {
        for(let object of objects) {
            removeFromArray(object, world.items)
            if(object instanceof Layer) {
                delete layer[getName(object)]
            } else {
                delete tileMap[getName(object)]
            }
        }
    }

    if(deleteObjectKey.wasPressed) {
        removeObjects()
        selectedObjects.length = 0
    }

    function hasNoLayer() {
        for(const object of objects) {
            if(object instanceof Layer) return false
        }
        return true
    }
    
    if(groupKey.wasPressed && objects.length > 1 && hasNoLayer()) {
        const newLayer = new Layer(...objects)
        setName(newLayer, getName(firstObject))
        removeObjects()
        world.add(newLayer)
    }

    if(ungroupKey.wasPressed) {
        for(const object of objects) {
            if(!object instanceof Layer) continue
            let index = 0
            for(const item of object.items) {
                world.add(item)
                setName(item, getName(objectUnderCursor) + index)
                index++
            }
            world.remove(object)
        }
    }
}


export const pivotRadius = 11

function findObject(items) {
    for(let object of items) {
        if(object instanceof Pivot) {
            if(distToScreen(dist(object.x - mouse.x, object.y - mouse.y)) <= settings.pivot.diameter) {
                objectUnderCursor = object
                continue
            }
        }

        if(!object.collidesWithPoint(mouse.x, mouse.y)) continue
        if(object instanceof Layer) {
            findObject(object.items)
            objectUnderCursor = object
            return
        } else {
            objectUnderCursor = object
            if(currentTileSet === object.tileSet || currentMode === mode.maps) {
                currentTileMap = object
            }
        }
    }

}

export function checkObjectsWindowCollisions() {
    currentTileMap = undefined
    objectUnderCursor = undefined
    currentTileSprite = undefined

    findObject(world.items)
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