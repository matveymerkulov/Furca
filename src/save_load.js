//import {initData, tileMap, tileMaps, tileSet} from "./project.js"
//import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"
//import {getName} from "./names.js"

import {initData, tileMap, tileMaps, tileSet} from "./project.js"
import {getName} from "./names.js"
import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"

export let indent = ""

export function addIndent() {
    indent += "\t"
}

export function removeIndent() {
    indent = indent.substring(1)
}

export function toString(value) {
    if(value instanceof Array) {
        let text = ""
        for(let item of value) {
            text += "," + toString(item)
        }
        return `[${text.substring(1)}]`
    }

    if(value instanceof Object) {
        return value.toString()
    }

    return value
}

export function arrayToString(array, columns, padding = 0) {
    let text = "["
    addIndent()
    for(let pos = 0; pos < array.length; pos++) {
        if(columns !== undefined && (pos % columns) === 0) {
            text +=`\n${indent}`
        }
        let item = array[pos]
        text += (columns === undefined ? toString(item) : item.toString().padStart(padding, " ")) + ", "
    }
    removeIndent()
    return text + (columns === undefined || array.length === 0 ? "" : "\n" + indent) + "]"
}

export function booleanArrayToString(array) {
    let text = ""
    addIndent()
    for(let pos = 0; pos < array.length; pos++) {
        text += array[pos] ? "1" : "0"
    }
    removeIndent()
    return `\"${text}\"`
}

export function projectToText(tabs, tabName, all) {
    const path = all ? "../src" : "../Furca/src"

    let text = ""
    text += `import {TileSet} from "${path}/tile_set.js"\n`
    text += `import {TileMap} from "${path}/tile_map.js"\n`
    text += `import {ImageArray} from "${path}/image_array.js"\n`
    text += `import {tileMap, tileMaps, tileSet} from "${path}/project.js"\n`
    text += `import {Block} from "${path}/block.js"\n`
    text += `import {Category, Pos, Rule} from "${path}/auto_tiling.js"\n`
    text += `import {texture} from "${path}/system.js"\n`
    if(all) text += `import {addTab, selectTab} from "./tabs.js"\n`
    text += '\nexport function loadData() {\n'

    const tileSets = new Set()
    if(!all) {
        for(let map of tabs[tabName].items) {
            tileSets.add(map.tileSet)
        }
    }

    indent = "\t"
    for(const set of Object.values(tileSet)) {
        if(!all && !tileSets.has(set)) continue
        text += `\ttileSet.${getName(set)} = ${set.toString()}\n`
    }

    text += "\t\n"

    for(const[name, layer] of Object.entries(tabs)) {
        if(!all && tabName !== name) continue

        for(let map of layer.items) {
            text += `\ttileMap.${getName(map)} = ${map.toString()}\n`
        }

        if(!all) continue

        text += `\taddTab("${name}"`
        for(let pos = 0; pos < layer.quantity; pos++) {
            if(pos > 0 && pos % 4 === 0) {
                text +="\n\t\t"
            }
            text += `, tileMap.${getName(layer.items[pos])}`
        }
        text += ")\n"
    }

    if(!all) return text + "}"

    text += `\tselectTab("${tabName}")\n}`
    return text
}

export function projectFromText(data, texture) {
    initParser(data)
    getSymbol("{")

    while(true) {
        switch(getToken()) {
            case "tileSet":
                getSymbol("[")
                let tileSetName = getString()
                getSymbol("(")
                getTileSet(texture, tileSetName)
                break
            case "tileMap":
                getSymbol("[")
                let tileMapName = getString()
                getSymbol("(")
                getTileMap(tileMapName)
                break
            case "tileMaps":
                while(getToken(")") !== "") {
                    getSymbol("[")
                    tileMaps.add(tileMap[getString()])
                }
                return
        }
    }
}

export function projectToClipboard(tabs) {
    navigator.clipboard.writeText(projectToText(tabs)).then()
}

export function projectToStorage(tabs, name) {
    localStorage.setItem("all", projectToText(tabs, name, true))
    localStorage.setItem("tab", projectToText(tabs, name))
}

export function projectFromStorage(texture) {
    initData()
    let text = localStorage.getItem("project")
    if(text !== null) projectFromText(text, texture)
}