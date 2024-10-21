import {tabs} from "./main.js"
import {Layer} from "../src/layer.js"
import {setTileMaps, tileMaps} from "../src/project.js"
import {currentCanvas} from "../src/canvas.js"
import {mapsCanvas} from "./tile_map.js"

export let currentTabName

export function selectTab(name) {
    setTileMaps(tabs[name])
    if(currentTabName !== undefined) {
        document.getElementById(currentTabName).classList.remove("current_tab")
    }
    document.getElementById(name).classList.add("current_tab")
    currentTabName = name

    let x0, y0, x1, y1
    for(let tileMap of tileMaps.items) {
        if(x0 === undefined || tileMap.left < x0) x0 = tileMap.left
        if(y0 === undefined || tileMap.top < y0) y0 = tileMap.top
        if(x1 === undefined || tileMap.right > x1) x1 = tileMap.right
        if(y1 === undefined || tileMap.bottom > y1) y1 = tileMap.bottom
    }

    mapsCanvas.setPosition(0.5 * (x0 + x1), 0.5 * (y0 + y1))
    mapsCanvas.setSize(x1 - x0, y1 - y0)
    mapsCanvas.updateParameters()
}

export function addTab(name, ...maps) {
    tabs[name] = new Layer(...maps)
    let div = document.createElement("div")
    div.classList.add("tab")
    div.innerText = name
    div.id = name
    div.onclick = function() {
        selectTab(this.id)
    }
    document.getElementById("tabs").append(div)
}