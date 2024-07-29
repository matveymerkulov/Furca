import {project, tileMap, tileSet} from "../src/project.js"
import {currentWindow, hideWindow} from "../src/gui/window.js"
import {setName} from "../src/names.js"
import {loadData} from "./data.js"
import {initTileSetSelectionWindow} from "./new_map.js"
import {deleteCurrentDrag} from "../src/drag.js"
import {projectFromStorage, projectToStorage} from "../src/save_load.js"
import Key from "../src/key.js"
import {mainWindow} from "./main_window.js"

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

let saveKey = new Key("KeyS")
let loadKey = new Key("KeyL")

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

project.renderNode = () => {
    mainWindow.renderNode()
    if(currentWindow === undefined || currentWindow === mainWindow) return
    currentWindow.renderNode()
}

project.updateNode = () => {
    mainWindow.updateNode()
    if(currentWindow === undefined) return
    currentWindow.updateNode()
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

    initTileSetSelectionWindow()

    project.update = () => {
        if(loadKey.wasPressed) {
            projectFromStorage(texture)
            initData()
        }

        if(saveKey.wasPressed) {
            projectToStorage()
        }
    }

    for(let item of document.getElementsByClassName("cancel")) {
        item.onclick = () => {
            hideWindow()
            deleteCurrentDrag()
        }
    }
}