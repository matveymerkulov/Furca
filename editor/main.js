import {project, tileMap, tileMaps, tileSet} from "../src/project.js"
import Canvas, {canvasUnderCursor, ctx, distToScreen, setCanvas, xToScreen, yToScreen} from "../src/canvas.js"
import {canvasMouse, element, mouse, removeFromArray} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
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
import SelectRegion, {regionSelector, setTileWidth, tileHeight, tileWidth} from "./select_region.js"

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

export let tileSetWindow = element("tile_set_window")

function initData() {
    for(const[name, object] of Object.entries(tileSet)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        setName(object, name)
    }
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

    maps = Canvas.create(element("map"), tileMaps, 30, 14)
    maps.background = "rgb(9, 44, 84)"
    maps.setZoom(-19)
    maps.add(new MoveTileMap(), select)
    maps.add(new Pan(), pan)
    maps.add(new Zoom(zoomIn, zoomOut))
    maps.add(new Select(), select)
    setCanvas(maps)

    tiles = Canvas.create(element("tiles"), new Layer(), 8, 14)
    tiles.add(new Pan(tiles), pan)
    tiles.add(new Zoom(zoomIn, zoomOut), pan)
    tiles.setZoom(-17)

    let tileSetCanvas = Canvas.create(element("tile_set"), new Layer(), 9, 16)
    tileSetCanvas.add(new SelectRegion(), select)

    maps.renderContents = () => {
        tileMaps.items.forEach(map => {
            map.draw()
            let name = getName(map)
            ctx.fillStyle = "white"
            ctx.font = "16px serif"
            // noinspection JSCheckFunctionSignatures
            let metrics = ctx.measureText(name)
            // noinspection JSCheckFunctionSignatures
            ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
                ,  yToScreen(map.topY) - 0.5 * metrics.actualBoundingBoxDescent - 4)
        })

        function drawCross(x, y, width, color) {
            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.lineWidth = width
            x = xToScreen(x)
            y = yToScreen(y)
            ctx.moveTo(x - 5, y)
            ctx.lineTo(x + 5, y)
            ctx.moveTo(x, y - 5)
            ctx.lineTo(x, y + 5)
            ctx.stroke()
            ctx.strokeStyle = "white"
            ctx.lineWidth = 1
        }

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

    let currentTile = 1, altTile = 0
    tiles.renderContents = function() {
        let quantity = 0
        for (const set of Object.values(tileSet)) {
            quantity += set.images.quantity
        }

        let start = 0
        let columns = Math.floor(tiles.width)
        let height = Math.ceil(quantity / columns)
        let x0 = distToScreen(0.5 * (tiles.width - columns))
        let y0 = distToScreen(0.5 * (tiles.height - height) - tiles.y)
        for (const set of Object.values(tileSet)) {
            let images = set.images
            let size = distToScreen(1)
            for(let i = 0; i < images.quantity; i++) {
                let pos = start + i
                let x = x0 + size * (pos % columns)
                let y = y0 + size * Math.floor(pos / columns)
                images.image(i).drawResized(x, y, size, size)
                if(set === currentTileSet && (currentTile === i || altTile === i)) {
                    drawDashedRect(x, y, size, size)
                }
                if(canvasUnderCursor !== tiles) continue
                if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                    currentTile = i
                    currentTileSet = set
                }
            }
            start += images.quantity
        }
    }

    tileSetCanvas.renderContents = () => {
        if(currentTileSet === undefined) return

        let images = currentTileSet.images
        let tex = images.texture
        let scale = Math.min((document.body.offsetWidth - 100) / tex.width
            , (document.body.offsetHeight - 100) / tex.height, 2)
        let style = tileSetCanvas.node.style
        let canvasWidth = tex.width * scale
        let canvasHeight = tex.height * scale
        style.width = canvasWidth + "px"
        style.height = canvasHeight + "px"
        setCanvas(tileSetCanvas)
        ctx.canvas.width = canvasWidth
        ctx.canvas.height = canvasHeight
        ctx.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, canvasWidth, canvasHeight)

        setTileWidth(canvasWidth / images.columns, canvasHeight / images.rows)

        drawDashedRect(Math.floor(canvasMouse.x / tileWidth) * tileWidth
            , Math.floor(canvasMouse.y / tileHeight) * tileHeight, tileWidth, tileHeight)

        if(regionSelector === undefined) return
        drawDashedRect(regionSelector.x * tileWidth, regionSelector.y * tileHeight
            , (regionSelector.width + 1) * tileWidth - 1, (regionSelector.height + 1) * tileHeight)
    }

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