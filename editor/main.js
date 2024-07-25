import {project, tileMap, tileSet} from "../src/project.js"
import Canvas, {canvasUnderCursor, setCanvas} from "../src/canvas.js"
import {element} from "../src/system.js"
import {projectFromStorage, projectToStorage} from "./save_load.js"
import Key from "../src/key.js"
import {currentWindow, hideWindow} from "../src/gui/window.js"
import MoveTileMaps from "./move_tile_maps.js"
import {Pan} from "./pan.js"
import Zoom from "./zoom.js"
import SelectTileMaps from "./select_tile_maps.js"
import {setName} from "./names.js"
import {loadData} from "./data.js"
import SelectTileSetRegion from "./select_tile_set_region.js"
import {renderBlocksTileSet, updateTileSetProperties} from "./tile_set_properties.js"
import {renderTileSet, tileSetOperations} from "./tile_set.js"
import {
    checkMapsWindowCollisions,
    currentTileMap,
    mainWindowOperations,
    mapModeOperations,
    renderMaps,
    tileMapOperations,
    tileMapUnderCursor,
    tileModeOperations
} from "./tile_map.js"
import {mapSizeWindow} from "./new_map.js"
import {deleteCurrentDrag} from "../src/drag.js"
import SelectMapRegion from "./select_map_region.js"
import TileZoom from "./tile_zoom.js"
import {TilePan} from "./tile_pan.js"
import {
    initRulesWindow,
    renderRulesGrid,
    renderRulesList,
    renderRulesTileSet,
    updateRulesWindow
} from "./auto_tiling.js"

export function clamp(value, min, max) {
    if(value < min) return min
    if(value > max) return max
    return value
}

project.getAssets = () => {
    return {
        texture: {
            floor: "farm_floor.png",
            objects: "farm_furniture.png",
            blocks: "blocks.png",
            smooth: "smooth.png",
            colors: "colors.png",
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
export let rulesWindow = element("rules_window")
export let blocksTileSetCanvas, rulesTileSetCanvas, rulesGrid, rulesList

export let tileWidth, tileHeight

export function setTileSize(width, height) {
    tileWidth = width
    tileHeight = height
}

function initData() {
    for(const[name, object] of Object.entries(tileSet)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        setName(object, name)
    }
}

export let selectKey = new Key("LMB")
export let delKey = new Key("Delete")
export let panKey = new Key("ControlLeft", "MMB")
export let zoomInKey = new Key("WheelUp")
export let zoomOutKey = new Key("WheelDown")
export let switchModeKey = new Key("Space")
export let saveKey = new Key("KeyS")
export let loadKey = new Key("KeyL")
export let renameMapKey = new Key("KeyO")
export let newMapKey = new Key("KeyN")
export let copyKey = new Key("KeyC")
export let tileSetPropertiesKey = new Key("KeyI")
export let toggleVisibilityKey = new Key("KeyV")
export let newBlockKey = new Key("KeyB")
export let newFrameKey = new Key("KeyF")
export let changeBrushTypeKey = new Key("KeyB")
export let incrementBrushSizeKey = new Key("NumpadAdd")
export let decrementBrushSizeKey = new Key("NumpadSubtract")
export let rectangleModeKey = new Key("KeyR")
export let autoTilingEditorKey = new Key("KeyA")
export let incrementGridSizeKey = new Key("NumpadAdd")
export let decrementGridSizeKey = new Key("NumpadSubtract")
//export let Key = new Key("NumpadSubtract")

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
    maps.add(new Pan(), panKey)
    maps.add(new Zoom(zoomInKey, zoomOutKey))
    maps.add(new SelectTileMaps(), selectKey)
    maps.add(new MoveTileMaps(), selectKey)
    maps.add(new SelectMapRegion(), selectKey)
    maps.renderContents = () => renderMaps()

    tiles = Canvas.create(element("tiles"), 8, 14)
    tiles.add(new TilePan(), panKey)
    tiles.add(new TileZoom(zoomInKey, zoomOutKey))
    tiles.renderContents = () => renderTileSet(selectKey)

    blocksTileSetCanvas = Canvas.create(element("tile_set_blocks"), 9, 16)
    blocksTileSetCanvas.add(new SelectTileSetRegion(), selectKey)
    blocksTileSetCanvas.renderContents = () => renderBlocksTileSet()

    rulesTileSetCanvas = Canvas.create(element("tile_set_rules"), 9, 16)
    rulesTileSetCanvas.renderContents = () => renderRulesTileSet()
    rulesGrid = Canvas.create(element("rules_grid"), 9, 16)
    rulesGrid.renderContents = () => renderRulesGrid()
    rulesList = Canvas.create(element("rules_list"), 9, 16)
    rulesList.renderContents = () => renderRulesList()
    initRulesWindow()

    project.render = () => {
        maps.render()
        tiles.render()
        if(currentWindow === tileSetWindow) {
            blocksTileSetCanvas.render()
        } else if(currentWindow === rulesWindow) {
            rulesTileSetCanvas.render()
            rulesGrid.render()
            rulesList.render()
        }
    }

    project.update = () => {
        if(loadKey.wasPressed) {
            projectFromStorage(texture)
            initData()
        }

        if(saveKey.wasPressed) {
            projectToStorage()
        }

        if(currentWindow === tileSetWindow) {
            updateTileSetProperties()
            return
        }

        if(currentWindow === rulesWindow) {
            updateRulesWindow()
            return
        }

        if(canvasUnderCursor === tiles) {
            tileSetOperations()
            return
        }

        maps.update()
        tiles.update()

        if(switchModeKey.wasPressed) {
            currentMode = currentMode === mode.tiles ? mode.maps : mode.tiles
        }

        mainWindowOperations()

        if(canvasUnderCursor !== maps) return

        setCanvas(maps)

        checkMapsWindowCollisions()

        if(tileMapUnderCursor === undefined) return

        tileMapOperations()

        if(currentTileMap === undefined) return

        if(currentMode === mode.tiles) {
            tileModeOperations()
        } else if(currentMode === mode.maps) {
            mapModeOperations()
        }
    }

    mapSizeWindow()

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => {
            hideWindow()
            deleteCurrentDrag()
        }
    }
}