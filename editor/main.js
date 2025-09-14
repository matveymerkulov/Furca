import {mainWindow} from "./main_window.js"
import {imageArray, initData, layer, project, tileMap, tileSet, world} from "../src/project.js"
import {currentWindow, hideWindow} from "../src/gui/window.js"
import {setName} from "../src/names.js"
//import {loadData} from "../data/breakout.js"
import {initTileSetSelectionWindow} from "./new_map.js"
import {deleteCurrentDrag} from "../src/drag.js"
import {loadTextures, projectFromText, projectToText} from "../src/save_load.js"
import {calculateTilesPerRow, currentTileSet} from "./tile_set.js"
import {resetRegionSelector} from "./select_tile_set_region.js"
import {tileSetPropertiesWindow, updateImageArraysList} from "./tile_set_properties.js"
import {rulesWindow, updateCategoriesList} from "./auto_tiling.js"
import {autoTilingEditorKey, cancelKey, loadKey, saveKey, tileSetPropertiesKey} from "./keys.js"
import {setBorderVisibility} from "../src/tile_map.js"
import {mapsCanvas} from "./tile_map.js"
import {max} from "../src/functions.js"
import {zk} from "../src/canvas.js"
import {readText} from "./loader.js"

export let tileWidth, tileHeight

export function setTileSize(width, height) {
    tileWidth = width
    tileHeight = height
}

export function showAll()  {
    let x0, y0, x1, y1

    world.processSprites((sprite) => {
        if(x0 === undefined || sprite.left < x0) x0 = sprite.left
        if(y0 === undefined || sprite.top < y0) y0 = sprite.top
        if(x1 === undefined || sprite.right > x1) x1 = sprite.right
        if(y1 === undefined || sprite.bottom > y1) y1 = sprite.bottom
    })

    mapsCanvas.setPosition(0.5 * (x0 + x1), 0.5 * (y0 + y1))
    mapsCanvas.setZoom(Math.log(max((x1 - x0) / mapsCanvas.viewport.width
        , (y1 - y0) / mapsCanvas.viewport.height)) / Math.log(zk) * 0.95)
}

function initNames() {
    for(const[name, object] of Object.entries(imageArray)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileSet)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(tileMap)) {
        setName(object, name)
    }

    for(const[name, object] of Object.entries(layer)) {
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
        if(cancelKey.wasPressed) {
            hideWindow()
            deleteCurrentDrag()
        }
    }
}



project.init = () => {
    initNames()

    initTileSetSelectionWindow()

    setBorderVisibility(true)

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => {
            hideWindow()
            deleteCurrentDrag()
        }
    }
}


mainWindow.update = () => {
    if(loadKey.wasPressed) {
        readText(function(e) {
            initData()
            const text = e.target.result
            loadTextures(text, () => {
                projectFromText(text)
                initNames()
                showAll()
                calculateTilesPerRow()
            })
        })
    }

    if(saveKey.wasPressed) {
        if(window.electron !== undefined) {
            window.electron.saveDialog('showSaveDialog', {}).then(result => {
                if(result.canceled) return
                window.electron.saveFile(result.filePath, projectToText())
            })
        } else {
            localStorage.setItem("project", projectToText())
        }
    }

    if(currentTileSet === undefined) return

    if(tileSetPropertiesKey.wasPressed) {
        resetRegionSelector()
        updateImageArraysList()
        tileSetPropertiesWindow.show()
    }

    if(autoTilingEditorKey.wasPressed) {
        rulesWindow.show()
        updateCategoriesList()
    }
}