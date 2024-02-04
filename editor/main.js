import {project, tileMap, tileMaps, tileSet} from "../src/project.js"
import Canvas, {canvasUnderCursor, ctx, distToScreen, setCanvas, xToScreen, yToScreen} from "../src/canvas.js"
import {canvasMouse, element, mouse, removeFromArray} from "../src/system.js"
import {drawDashedRect} from "../src/draw.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {projectFromStorage, projectToStorage} from "./save_load.js"
import Key from "../src/key.js"
import Layer from "../src/layer.js"
import {currentWindow, hideWindow, showWindow} from "../src/gui/window.js"
import MoveTileMap from "./move_tile_map.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import Select, {clearSelection, selected, selector} from "./select.js"
import {addTileMap, createTileMap} from "./create_tile_map.js"
import {getName, incrementName, setName} from "./names.js"
import {loadData} from "./data.js"
import SelectRegion, {
    regionSelector,
    resetRegionSelector,
    setTileWidth,
    tileHeight,
    tileWidth
} from "./select_region.js"
import {drawCross} from "./draw.js"
import {renderTileSetProperties} from "./tile_set_properties.js"
import {renderTileSet} from "./render_tile_set.js"
import {renderMaps} from "./render_maps.js"

project.getAssets = () => {
    return {
        texture: {
            floor: "farm_floor.png",
            objects: "farm_furniture.png",
            blocks: "tetris.png",
        },
        sound: {
        }
    }
}

export const mode = {
    tiles: Symbol("tiles"),
    maps: Symbol("maps"),
}

export let maps, tiles
export let currentTileMap, currentTileSet, tileMapUnderCursor, currentTileSprite
export let currentMode = mode.tiles, centerX, centerY
export let currentTile = 1, altTile = 0

export let tileSetWindow = element("tile_set_window")

function initData() {
    for(const[name, object] of Object.entries(tileSet)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        setName(object, name)
    }
}

export function setCurrentTile(set, i) {
    currentTile = i
    currentTileSet = set
}

project.init = (texture) => {
    /*if(localStorage.getItem("project") === null) {
        loadData(texture)
    } else {
        loadData(texture)
        //projectFromStorage(texture)
    }

    window.onbeforeunload = function() {
        projectToStorage()
        projectToClipboard()
    }*/

    loadData(texture)
    initData()

    let select = new Key("LMB")
    let del = new Key("Delete")
    let pan = new Key("ControlLeft", "MMB")
    let zoomIn = new Key("WheelUp")
    let zoomOut = new Key("WheelDown")
    let switchMode = new Key("Space")
    let save = new Key("KeyS")
    let load = new Key("KeyL")
    let renameMap = new Key("KeyR")
    let newMap = new Key("KeyN")
    let copy = new Key("KeyC")
    let turnMap = new Key("KeyT")
    let tileSetProperties = new Key("KeyI")
    let visibility = new Key("KeyV")
    let block = new Key("KeyB")

    maps = Canvas.create(element("map"), 30, 14)
    maps.background = "rgb(9, 44, 84)"
    maps.setZoom(-19)
    maps.add(new MoveTileMap(), select)
    maps.add(new Pan(), pan)
    maps.add(new Zoom(zoomIn, zoomOut))
    maps.add(new Select(), select)
    setCanvas(maps)

    tiles = Canvas.create(element("tiles"), 8, 14)
    tiles.add(new Pan(tiles), pan)
    tiles.add(new Zoom(zoomIn, zoomOut), pan)
    tiles.setZoom(-17)

    let tileSetCanvas = Canvas.create(element("tile_set"), 9, 16)
    tileSetCanvas.add(new SelectRegion(), select)

    maps.renderContents = () => renderMaps()
    tiles.renderContents = () => renderTileSet(select)
    tileSetCanvas.renderContents = () => renderTileSetProperties(tileSetCanvas)

    project.render = () => {
        maps.render()
        tiles.render()
        tileSetCanvas.render()
    }

    let currentName = "", newX, newY

    project.update = () => {
        if(currentWindow === tileSetWindow) {
            setCanvas(tileSetCanvas)
            tileSetCanvas.update()

            if(regionSelector === undefined) return

            if(visibility.wasPressed) {
                let hide
                regionSelector.process((tileNum) => {
                    if(hide === undefined) hide = !currentTileSet.hidden[tileNum]
                    currentTileSet.hidden[tileNum] = hide
                })
            }

            if(block.wasPressed) {
                currentTileSet.blocks.push(regionSelector)
            }

            return
        }

        maps.update()
        tiles.update()

        if(switchMode.wasPressed) {
            currentMode = currentMode === mode.tiles ? mode.maps : mode.tiles
        }

        if(load.wasPressed) {
            projectFromStorage(texture)
            initData()
        }

        if(save.wasPressed) {
            projectToStorage()
        }

        if(del.wasPressed && selected.length > 0) {
            for(let map of selected) {
                removeFromArray(map, tileMaps.items)
                delete tileMap[getName(map)]
            }
            clearSelection()
        }

        if(tileSetProperties.wasPressed) {
            resetRegionSelector()
            showWindow(tileSetWindow)
        }

        if(canvasUnderCursor !== maps) return

        setCanvas(maps)

        if(newMap.wasPressed) {
            newX = Math.round(mouse.x)
            newY = Math.round(mouse.y)
            currentName = prompt("Введите имя новой карты:")
            if(currentName === null) {
                hideWindow()
            } else {
                showWindow("map_size")
            }
        }

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

        if(tileMapUnderCursor === undefined) return

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

        if(turnMap.wasPressed) {
            tileMapUnderCursor.turnClockwise(centerX, centerY)
        }

        switch(currentMode) {
            case mode.tiles:
                if(currentTileMap === undefined) return

                let tile = currentTileMap.tileForPoint(mouse)
                if(tile < 0) break
                if(select.isDown) {
                    currentTileMap.setTile(tile, currentTile)
                } else if(del.isDown) {
                    currentTileMap.setTile(tile, altTile)
                }
                currentTileSprite = currentTileMap.tileSprite(tile)
                break
            case mode.maps:
                if(del.wasPressed && selected.length === 0) {
                    removeFromArray(tileMapUnderCursor, tileMaps.items)
                    delete tileMap[getName(tileMapUnderCursor)]
                }
                break
        }
    }

    let tileSets = element("tile_sets")
    let columnsField = element("columns")
    let rowsField = element("rows")
    element("map_size_ok").onclick = () => {
        tileSets.innerHTML = ""
        for(const[name, set] of Object.entries(tileSet)) {
            let button = document.createElement("button")
            button.innerText = name
            button.tileSet = set
            button.onclick = (event) => {
                createTileMap(currentName, event.target.tileSet
                    , parseInt(columnsField.value), parseInt(rowsField.value), newX, newY)
                hideWindow()
            }
            tileSets.appendChild(button)
        }
        showWindow("select_tile_set")
    }

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => hideWindow()
    }
}