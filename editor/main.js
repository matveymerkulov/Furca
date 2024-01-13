import {project} from "../src/project.js"
import Canvas, {
    ctx,
    currentCanvas,
    distFromScreen,
    distToScreen,
    setCanvas,
    xToScreen,
    yToScreen
} from "../src/canvas.js"
import {canvasMouse, mouse, screenMouse} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
import {boxWithPointCollision} from "../src/collisions.js"
import MouseMove from "./mouse_move.js"
import DashedRect from "./dashed_rect.js"
import {projectFromStorage, projectFromText, projectToClipboard, projectToStorage} from "../src/save_load.js"
import Key from "../src/key.js"
import Layer from "../src/layer.js"
import {loadData, tileMap, tileMaps, tileSet} from "./data.js"
import TileMap from "../src/tile_map.js"

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

const mode = {
    tiles: Symbol("tiles"),
    tileMaps: Symbol("tileMaps"),
}

function element(name) {
    return document.getElementById(name)
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

    let objectName = new Map()
    for(const[name, object] of Object.entries(tileMap)) {
        objectName.set(object, name)
    }

    let select = new Key("LMB")
    let move = new Key("ControlLeft", "MMB")
    let zoomIn = new Key("WheelUp")
    let zoomOut = new Key("WheelDown")
    let switchMode = new Key("Space")
    let save = new Key("KeyS")
    let renameMap = new Key("KeyR")
    let newMap = new Key("KeyN")
    let copyMap = new Key("KeyC")
    let turnMap = new Key("KeyT")

    let currentMode = mode.tiles
    let currentPopup

    let maps = Canvas.create(element("map"), tileMaps, 30, 14)
    maps.background = "rgb(9, 44, 84)"
    let tiles = Canvas.create(element("tiles"), new Layer(), 8, 14)
    setCanvas(maps)

    let mouseX0, mouseY0, cameraX0, cameraY0
    maps.setZoom(-19)
    tiles.setZoom(-17)

    let mouseCanvas
    maps.node.addEventListener("mouseover", () => {
        mouseCanvas = maps
    })
    tiles.node.addEventListener("mouseover", () => {
        mouseCanvas = tiles
    })

    function processCamera(canvas) {
        while(true) {
            if (mouseCanvas !== canvas) break

            if (move.wasPressed) {
                mouseX0 = screenMouse.x
                mouseY0 = screenMouse.y
                cameraX0 = canvas.x
                cameraY0 = canvas.y
            } else if (move.isDown) {
                canvas.x = cameraX0 + distFromScreen(mouseX0 - screenMouse.x)
                canvas.y = cameraY0 + distFromScreen(mouseY0 - screenMouse.y)
                canvas.update()
            }

            if (zoomIn.wasPressed) {
                canvas.setZoom(canvas.zoom - 1)
            } else if (zoomOut.wasPressed) {
                canvas.setZoom(canvas.zoom + 1)
            } else {
                break
            }

            canvas.setZoomXY(canvas.zoom, screenMouse.x, screenMouse.y)
            break
        }

        setCanvas(canvas)
        canvas.draw()
    }

    function showPopup(name) {
        hidePopup()
        currentPopup = document.getElementById(name)
        currentPopup.style.visibility = "visible"
    }

    function hidePopup() {
        if(currentPopup !== undefined) currentPopup.style.visibility = "hidden"
        currentPopup = undefined
    }

    let currentTile = 0
    let currentTileSet
    tiles.scene.draw = function() {
        let quantity = 0
        for (const set of Object.values(tileSet)) {
            quantity += set.images.quantity
        }

        setCanvas(tiles)
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
                if(mouseCanvas !== tiles) continue
                if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                    currentTile = i
                    currentTileSet = set
                }
            }
            start += images.quantity
        }
    }

    let moveMap = new MouseMove(undefined, select)
    let mapSelection = new DashedRect()

    maps.scene.draw = () => {
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
    }

    project.draw = () => {}

    let currentName = "", newX, newY

    project.update = () => {
        processCamera(maps)
        processCamera(tiles)

        if(switchMode.wasPressed) {
            currentMode = currentMode === mode.tiles ? mode.tileMaps : mode.tiles
        }

        if(save.wasPressed) {
            projectToClipboard()
        }

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

        if(mouseCanvas !== maps) return

        setCanvas(maps)

        let currentTileMap = undefined
        tileMaps.collisionWithPoint(mouse.x, mouse.y, (x, y, map) => {
            if(currentMode === mode.tileMaps || map.tileSet === currentTileSet) {
                currentTileMap = map
            }
        })

        moveMap.object = currentTileMap
        tileMap.main.items[0].setPositionAs(tileMap.main.items[1])
        mapSelection.object = undefined
        if(currentTileMap === undefined) return

        switch(currentMode) {
            case mode.tiles:
                let tile = currentTileMap.tileForPoint(mouse)
                if(tile < 0) break
                if(select.isDown) {
                    currentTileMap.setTile(tile, currentTile)
                }
                let sprite = currentTileMap.tileSprite(tile)
                if(sprite === undefined) break
                sprite.drawDashedRect()
                break
            case mode.tileMaps:
                mapSelection.object = currentTileMap
                moveMap.execute()
                mapSelection.draw()

                if(currentTileMap === undefined) break

                if(copyMap.wasPressed) {
                    let name = prompt("Enter name of new tile map:", objectName.get(currentTileMap))
                    if(name === null) break
                    let map = currentTileMap.copy()
                    objectName.set(map, name)
                    tileMaps.add(map)
                }

                if(renameMap.wasPressed) {
                    let name = prompt("Enter name of tile map:", objectName.get(currentTileMap))
                    if(name === null) break
                    objectName.set(currentTileMap, name)
                }

                if(turnMap.wasPressed) {
                    currentTileMap.turn()
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

    for(element of document.getElementsByClassName("cancel")) {
        element.onclick = () => hidePopup()
    }
}