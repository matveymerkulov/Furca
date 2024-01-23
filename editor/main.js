import {project} from "../src/project.js"
import Canvas, {canvasUnderCursor, ctx, distToScreen, setCanvas, xToScreen, yToScreen} from "../src/canvas.js"
import {canvasMouse, element, mouse, screenMouse} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {projectToClipboard, projectToStorage} from "../src/save_load.js"
import Key from "../src/key.js"
import Layer from "../src/layer.js"
import {loadData, tileMap, tileMaps, tileSet} from "./data.js"
import TileMap from "../src/tile_map.js"
import {hidePopup, showPopup} from "../src/gui/popup.js"
import MoveTileMap from "./move_tile_map.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import Select from "./select.js"

project.getAssets = () => {
    return {
        texture: {
            floor: "farm_floor.png",
            objects: "farm_furniture.png",
        },
        sound: {
        }
    }
}

export const mode = {
    tiles: Symbol("tiles"),
    maps: Symbol("maps"),
}

export let currentTileMap, currentMode = mode.tiles, currentTileSprite, maps, tiles

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

    let objectName = new Map()
    for(const[name, object] of Object.entries(tileMap)) {
        objectName.set(object, name)
    }

    let select = new Key("LMB")
    let pan = new Key("ControlLeft", "MMB")
    let zoomIn = new Key("WheelUp")
    let zoomOut = new Key("WheelDown")
    let switchMode = new Key("Space")
    let save = new Key("KeyS")
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
    maps.add(new Zoom(zoomIn, zoomOut), pan)
    maps.add(new Select(), select)
    setCanvas(maps)

    tiles = Canvas.create(element("tiles"), new Layer(), 8, 14)
    let tileSetCanvas = element("tile_set")
    tiles.add(new Pan(tiles), pan)
    tiles.add(new Zoom(zoomIn, zoomOut), pan)
    tiles.setZoom(-17)

    let currentTile = 0
    let currentTileSet
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
                if(set === currentTileSet && currentTile === i) {
                    drawDashedRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size))
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

    maps.renderContents = () => {
        tileMaps.items.forEach(map => {
            map.draw()
            let name = objectName.get(map)
            if(map instanceof Layer) map = map.items[0]
            ctx.fillStyle = "white"
            ctx.font = "16px serif"
            let metrics = ctx.measureText(name)
            ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
                ,  yToScreen(map.topY) - 0.5 * metrics.actualBoundingBoxDescent - 4)
        })

        switch(currentMode) {
            case mode.tiles:
                if(currentTileSprite !== undefined) {
                    currentTileSprite.drawDashedRect()
                }
                break
            case mode.maps:
                if(Select.shape !== undefined) {
                    Select.shape.drawDashedRect()
                } else if(currentTileMap !== undefined) {
                    currentTileMap.drawDashedRect()
                }
                break
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

        if(save.wasPressed) {
            projectToClipboard()
        }

        if(canvasUnderCursor !== maps) return

        setCanvas(maps)

        if(newMap.wasPressed) {
            newX = mouse.x
            newY = mouse.y
            currentName = prompt("Введите имя новой карты:")
            if(currentName === null) {
                hidePopup()
            } else {
                showPopup("map_size")
            }
        }

        currentTileMap = undefined
        currentTileSprite = undefined

        if(currentMode === mode.maps && Select.shape === undefined) {
            tileMaps.collisionWithPoint(mouse.x, mouse.y, (x, y, map) => {
                 if(map.tileSet === currentTileSet) {
                    currentTileMap = map
                }
            })
        }

        tileMap.main.items[0].setPositionAs(tileMap.main.items[1])
        if(currentTileMap === undefined) return

        switch(currentMode) {
            case mode.tiles:
                let tile = currentTileMap.tileForPoint(mouse)
                if(tile < 0) break
                if(select.isDown) {
                    currentTileMap.setTile(tile, currentTile)
                }
                currentTileSprite = currentTileMap.tileSprite(tile)
                break
            case mode.maps:
                if(copyMap.wasPressed) {
                    let name = prompt("Enter name of new tile map:", objectName.get(currentTileMap))
                    if(name === null) break
                    let map = currentTileMap.copy()
                    objectName.set(map, name)
                    tileMaps.add(map)
                }

                if(renameMap.wasPressed) {
                    let name = prompt("Enter new name of tile map:", objectName.get(currentTileMap))
                    if(name === null) break
                    objectName.set(currentTileMap, name)
                }

                if(turnMap.wasPressed) {
                    currentTileMap.turnClockwise()
                }

                if(tileSetProperties.wasPressed) {
                    tileSetCanvas.style.height = (document.body.offsetHeight - 100) + "px"
                    showPopup("tile_set_properties")
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