import {project} from "../src/project.js"
import Canvas, {canvasUnderCursor, ctx, distToScreen, setCanvas, xFromScreen, xToScreen, yFromScreen, yToScreen} from "../src/canvas.js"
import {canvasMouse, element, mouse, screenMouse} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {projectFromStorage, projectToClipboard, projectToStorage} from "../src/save_load.js"
import Key from "../src/key.js"
import Layer from "../src/layer.js"
import {loadData, tileMap, tileMaps, tileSet} from "./data.js"
import TileMap from "../src/tile_map.js"
import {hidePopup, showPopup} from "../src/gui/popup.js"
import MoveTileMap from "./move_tile_map.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import Select, {selected, selector} from "./select.js"

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
export let objectName = new Map(), currentMode = mode.tiles, centerX, centerY

function initData() {
    for(const[name, object] of Object.entries(tileSet)) {
        objectName.set(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        objectName.set(object, name)
    }
}

project.init = (texture) => {
    if(localStorage.getItem("project") === null) {
        loadData(texture)
    } else {
        loadData(texture)
        //projectFromStorage(texture)
    }

    window.onbeforeunload = function() {
        projectToStorage()
        projectToClipboard()
    }

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
    let copyMap = new Key("KeyC")
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
    let tileSetCanvas = element("tile_set")
    tiles.add(new Pan(tiles), pan)
    tiles.add(new Zoom(zoomIn, zoomOut), pan)
    tiles.setZoom(-17)

    maps.renderContents = () => {
        tileMaps.items.forEach(map => {
            map.draw()
            let name = objectName.get(map)
            ctx.fillStyle = "white"
            ctx.font = "16px serif"
            let metrics = ctx.measureText(name)
            ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
                ,  yToScreen(map.topY) - 0.5 * metrics.actualBoundingBoxDescent - 4)
        })

        function drawCross(x, y, width, color) {
            ctx.strokeStyle = color
            ctx.lineWidth = width
            x = xFromScreen(x)
            y = yFromScreen(y)
            ctx.moveTo(x - 5, y)
            ctx.lineTo(x + 5, y)
            ctx.moveTo(x, y - 5)
            ctx.lineTo(x, y + 5)
        }

        switch(currentMode) {
            case mode.tiles:
                if(currentTileSprite !== undefined) {
                    currentTileSprite.drawDashedRect()
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
                    drawCross(centerX, centerY, 2, "black")
                    drawCross(centerX, centerY, 1, "white")
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

    project.render = () => {
        maps.render()
        tiles.render()
    }

    let currentName = "", newX, newY

    project.update = () => {
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

        if(canvasUnderCursor !== maps) return

        setCanvas(maps)

        if(newMap.wasPressed) {
            newX = Math.round(mouse.x)
            newY = Math.round(mouse.y)
            currentName = prompt("Введите имя новой карты:")
            if(currentName === null) {
                hidePopup()
            } else {
                showPopup("map_size")
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

        if(currentTileMap === undefined) return

        centerX = Math.floor(2.0 * currentTileMap.fColumn(mouse)) * 0.5
        centerY = Math.floor(2.0 * currentTileMap.fRow(mouse)) * 0.5

        if(copyMap.wasPressed) {
            let name = prompt("Enter name of new tile map:", objectName.get(currentTileMap))
            if(name !== null) {
                let map = currentTileMap.copy()
                objectName.set(map, name)
                tileMap[name] = map
                tileMaps.add(map)
            }
        }

        if(renameMap.wasPressed) {
            let name = prompt("Enter new name of tile map:", objectName.get(currentTileMap))
            if(name !== null) {
                objectName.set(currentTileMap, name)
            }
        }

        if(turnMap.wasPressed) {
            currentTileMap.turnClockwise()
        }

        if(tileSetProperties.wasPressed) {
            tileSetCanvas.style.height = (document.body.offsetHeight - 100) + "px"
            showPopup("tile_set_properties")
        }

        switch(currentMode) {
            case mode.tiles:
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
                let map = new TileMap(event.target.tileSet, parseInt(columnsField.value), parseInt(rowsField.value)
                    , newX, newY, 1, 1)
                tileMap[currentName] = map
                objectName.set(map, currentName)
                tileMaps.add(map)
                hidePopup()
            }
            tileSets.appendChild(button)
        }
        showPopup("select_tile_set")
    }

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => hidePopup()
    }
}