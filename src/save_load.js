//import {initData, tileMap, tileMaps, tileSet} from "./project.js"
//import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"
//import {getName} from "./names.js"

import {initData, tileMap, tileMaps, tileSet} from "./project.js"
import {getName} from "./names.js"
import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"
import {TileSet} from "./tile_set.js"
import {ImageArray} from "./image_array.js"
import {texture} from "./system.js"

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

export function projectToText() {
    const path = "../src"

    let text = ""
    text += `import {TileSet} from "${path}/tile_set.js"\n`
    text += `import {TileMap} from "${path}/tile_map.js"\n`
    text += `import {ImageArray} from "${path}/image_array.js"\n`
    text += `import {tileMap, tileMaps, tileSet} from "${path}/project.js"\n`
    text += `import {Block} from "${path}/block.js"\n`
    text += `import {Category, Pos, Rule} from "${path}/auto_tiling.js"\n`
    text += `import {texture} from "${path}/system.js"\n`
    text += '\nexport function loadData() {\n'

    indent = "\t"
    for(const set of Object.values(tileSet)) {
        text += `\ttileSet.${getName(set)} = ${set.toString()}\n`
    }

    text += "\t\n"

    for(const[name, map] of Object.entries(tileMap)) {
        text += `\ttileMap.${name} = ${map.toString()}\n`
    }

    return text + "}"
}

export function projectFromText(data) {
    initParser(data)
    getSymbol("(")
    getSymbol("{")

    while(true) {
        let token = getToken("}")
        if(token === "") break
        switch(token) {
            case "tileSet":
                getSymbol(".")
                let tileSetName = getToken()
                getSymbol("(")
                getTileSet(tileSetName)
                break
            case "tileMap":
                let tileMapName = getToken()
                getSymbol("(")
                getTileMap(tileMapName)
                break
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