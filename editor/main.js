import {mainWindow} from "./main_window.js"
import {project, tileMap, tileSet} from "../src/project.js"
import {currentWindow, hideWindow} from "../src/gui/window.js"
import {setName} from "../src/names.js"
//import {loadData} from "../data/breakout.js"
import {loadData} from "./data.js"
import {initTileSetSelectionWindow} from "./new_map.js"
import {deleteCurrentDrag} from "../src/drag.js"
import {projectFromStorage, projectToStorage} from "../src/save_load.js"
import {Key} from "../src/key.js"
import {currentTileSet} from "./tile_set.js"
import {resetRegionSelector} from "./select_tile_set_region.js"
import {tileSetPropertiesWindow} from "./tile_set_properties.js"
import {rulesWindow, updateCategoriesList} from "./auto_tiling.js"
import {texture} from "../src/system.js"
import {autoTilingEditorKey, loadKey, saveKey, tileSetPropertiesKey} from "./keys.js"
import {currentTabName} from "./tabs.js"
import {setBorderVisibility, showBorder} from "../src/tile_map.js"

project.getAssets = () => {
    return {
        texture: ["blocks.png", "bricks.png", "tiles.png", "objects.png"],
        sound: []
    }
}

export let tileWidth, tileHeight
export let tabs = new Map()

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

project.renderNode = () => {
    mainWindow.renderNode()
    if(currentWindow === undefined || currentWindow === mainWindow) return
    currentWindow.renderNode()
}

project.updateNode = () => {
    project.update()
    if(currentWindow === undefined) {
        mainWindow.updateNode()
    } else {
        currentWindow.updateNode()
    }
}



project.init = () => {
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

    loadData()
    initData()

    initTileSetSelectionWindow()

    setBorderVisibility(true)

    project.update = () => {
        if(loadKey.wasPressed) {
            projectFromStorage(texture)
            initData()
        }

        if(saveKey.wasPressed) {
            projectToStorage(tabs, currentTabName)
        }
    }

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => {
            hideWindow()
            deleteCurrentDrag()
        }
    }
}


mainWindow.update = () => {
    if(currentTileSet === undefined) return

    if(tileSetPropertiesKey.wasPressed) {
        resetRegionSelector()
        tileSetPropertiesWindow.show()
    }

    if(autoTilingEditorKey.wasPressed) {
        rulesWindow.show()
        updateCategoriesList()
    }
}