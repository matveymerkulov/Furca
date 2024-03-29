import {project, tileMap, tileSet} from "../src/project.js"
import Canvas, {canvasUnderCursor, setCanvas} from "../src/canvas.js"
import {element} from "../src/system.js"
import {projectFromStorage, projectToStorage} from "./save_load.js"
import Key from "../src/key.js"
import {currentWindow, hideWindow, showWindow} from "../src/gui/window.js"
import MoveTileMap from "./move_tile_map.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import Select from "./select.js"
import {setName} from "./names.js"
import {loadData} from "./data.js"
import SelectRegion, {resetRegionSelector} from "./select_region.js"
import {renderTileSetProperties} from "./tile_set_properties.js"
import {currentTileSet, renderTileSet, updateTileSetProperties} from "./tile_set.js"
import {
    checkCollisions,
    currentTileMap,
    mapsModeOperations,
    mapWindowOperations,
    renderMaps,
    tileMapOperations,
    tileMapUnderCursor,
    tileModeOperations
} from "./tile_map.js"
import {mapSizeWindow, updateNewMapWindow} from "./new_map.js"

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
export let currentMode = mode.tiles

export let tileSetWindow = element("tile_set_window")
export let tileSetCanvas

function initData() {
    for(const[name, object] of Object.entries(tileSet)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        setName(object, name)
    }
}

export let select = new Key("LMB")
export let del = new Key("Delete")
export let pan = new Key("ControlLeft", "MMB")
export let zoomIn = new Key("WheelUp")
export let zoomOut = new Key("WheelDown")
export let switchMode = new Key("Space")
export let save = new Key("KeyS")
export let load = new Key("KeyL")
export let renameMap = new Key("KeyR")
export let newMap = new Key("KeyN")
export let copy = new Key("KeyC")
export let turnMap = new Key("KeyT")
export let tileSetProperties = new Key("KeyI")
export let toggleVisibility = new Key("KeyV")
export let block = new Key("KeyB")

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

    maps = Canvas.create(element("map"), 30, 14)
    maps.background = "rgb(9, 44, 84)"
    maps.setZoom(-19)
    maps.add(new MoveTileMap(), select)
    maps.add(new Pan(), pan)
    maps.add(new Zoom(zoomIn, zoomOut))
    maps.add(new Select(), select)
    maps.renderContents = () => renderMaps()
    setCanvas(maps)

    tiles = Canvas.create(element("tiles"), 8, 14)
    tiles.add(new Pan(tiles), pan)
    tiles.add(new Zoom(zoomIn, zoomOut), pan)
    tiles.setZoom(-17)
    tiles.renderContents = () => renderTileSet(select)

    tileSetCanvas = Canvas.create(element("tile_set"), 9, 16)
    tileSetCanvas.add(new SelectRegion(), select)
    tileSetCanvas.renderContents = () => renderTileSetProperties(tileSetCanvas)

    project.render = () => {
        maps.render()
        tiles.render()
        tileSetCanvas.render()
    }

    project.update = () => {
        if(currentWindow === tileSetWindow) {
            updateTileSetProperties()
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

        mapWindowOperations()

        if(tileSetProperties.wasPressed && currentTileSet !== undefined) {
            resetRegionSelector()
            showWindow(tileSetWindow)
        }

        if(canvasUnderCursor !== maps) return

        setCanvas(maps)

        updateNewMapWindow()

        checkCollisions()

        if(tileMapUnderCursor === undefined) return

        tileMapOperations()

        if(currentTileMap === undefined) return

        if(currentMode === mode.tiles) {
            tileModeOperations()
        } else if(currentMode === mode.maps) {
            mapsModeOperations()
        }
    }

    mapSizeWindow()

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => hideWindow()
    }
}