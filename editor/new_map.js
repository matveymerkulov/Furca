import {element, mouse} from "../src/system.js"
import {hideWindow, Win} from "../src/gui/window.js"
import {tileSet} from "../src/project.js"
import {createTileMap} from "./create_tile_map.js"
import {enterString} from "./input.js"

let currentName = "", newX, newY

let tileSets = element("tile_sets")
let columnsField = element("columns")
let rowsField = element("rows")

export let mapSizeWindow = new Win("map_size")
export let tileSetSelectionWindow = new Win("select_tile_set")

export function initTileSetSelectionWindow() {
    element("map_size_ok").onclick = () => {
        tileSets.innerHTML = ""
        for(const[name, set] of Object.entries(tileSet)) {
            let button = document.createElement("button")
            button.innerText = name
            button.tileSet = set
            button.onclick = (event) => {
                createTileMap(currentName, event.target.tileSet
                    , parseInt(columnsField.value), parseInt(rowsField.value), newX, newY)
                tileSetSelectionWindow.hide()
            }
            tileSets.appendChild(button)
        }
        mapSizeWindow.hide()
        tileSetSelectionWindow.show()
    }
}

export function newMap() {
    newX = Math.round(mouse.x)
    newY = Math.round(mouse.y)
    enterString("Введите название новой карты:", "", (name) => {
        currentName = name
        mapSizeWindow.show()
    }, () => {
        hideWindow()
    })
}