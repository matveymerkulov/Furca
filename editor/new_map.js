import {element, mouse} from "../src/system.js"
import {hideWindow, showWindow} from "../src/gui/window.js"
import {newMap} from "./main.js"
import {tileSet} from "../src/project.js"
import {createTileMap} from "./create_tile_map.js"


let currentName = "", newX, newY

let tileSets = element("tile_sets")
let columnsField = element("columns")
let rowsField = element("rows")

export function mapSizeWindow() {
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
}

export function updateNewMapWindow() {
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
}