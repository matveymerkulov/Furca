import {element, mouse} from "../src/system.js"
import {hideWindow, Win} from "../src/gui/window.js"
import {tileSet} from "../src/project.js"
import {createTileMap} from "./create_tile_map.js"
import {enterString} from "./input.js"

let currentName = "", newX, newY

let tileSets = element("tile_sets")
let columnsField = element("columns") as HTMLInputElement
let rowsField = element("rows") as HTMLInputElement

export let mapSizeWindow = new Win("map_size")
export let tileSetSelectionWindow = new Win("select_tile_set")

export function initTileSetSelectionWindow() {
    element("map_size_ok").onclick = () => {
        tileSets.innerHTML = ""
        for(const[name, set] of Object.entries(tileSet)) {
            let button = document.createElement("button") as HTMLButtonElement
            button.innerText = name
            button["tileSet"] = set
            button.onclick = (event) => {
                createTileMap(currentName, event.target["tileSet"]
                    , parseInt(columnsField.value), parseInt(rowsField.value), newX, newY)
                tileSetSelectionWindow.close()
            }
            tileSets.appendChild(button)
        }
        mapSizeWindow.close()
        tileSetSelectionWindow.open()
    }
}

export function newMap() {
    newX = Math.round(mouse.x)
    newY = Math.round(mouse.y)
    enterString("Введите название новой карты:", "", (name) => {
        currentName = name
        mapSizeWindow.open()
    }, () => {
        hideWindow()
    })
}