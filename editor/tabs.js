import {showAll, tabs} from "./main.js"
import {Layer} from "../src/layer.js"
import {setTileMaps, tileMaps} from "../src/project.js"
import {currentCanvas, zk} from "../src/canvas.js"
import {mapsCanvas} from "./tile_map.js"
import {max, min} from "../src/functions.js"

export let currentTabName

export function selectTab(name) {
    setTileMaps(tabs.get(name))
    if(currentTabName !== undefined) {
        document.getElementById(currentTabName).classList.remove("current_tab")
    }
    document.getElementById(name).classList.add("current_tab")
    currentTabName = name

    showAll()
}

export function addTab(name, ...maps) {
    tabs.set(name, new Layer(...maps))
    let div = document.createElement("div")
    div.classList.add("tab")
    div.innerText = name
    div.id = name
    div.onclick = function() {
        selectTab(this.id)
    }
    document.getElementById("tabs").append(div)
}