import {tabs} from "./main.js"
import {Layer} from "../src/layer.js"
import {setTileMaps} from "../src/project.js"

export let currentTabName

export function selectTab(name) {
    setTileMaps(tabs[name])
    if(currentTabName !== undefined) {
        document.getElementById(currentTabName).classList.remove("current_tab")
    }
    document.getElementById(name).classList.add("current_tab")
    currentTabName = name
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