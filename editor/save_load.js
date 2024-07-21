import {initData, tileMap, tileMaps, tileSet} from "../src/project.js"
import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "../src/parser.js"
import {getName} from "./names.js"

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
    let text = ""
    text += `export function loadData(texture) {\n`

    indent = "\t"
    for(const set of Object.values(tileSet)) {
        text += `\ttileSet["${getName(set)}"] = ${set.toString()}\n`
    }

    text += "\t\n"

    for(let map of tileMaps.items) {
        text += `\ttileMap["${getName(map)}"] = ${map.toString()}\n`
    }

    text += "\n\ttileMaps.add("
    for(let pos = 0; pos < tileMaps.items.length; pos++) {
        if(pos % 4 === 0) {
            text +="\n\t\t"
        }
        text += `tileMap["${getName(tileMaps.items[pos])}"], `
    }
    text += "\n\t)\n"

    text += "}"
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

export function projectToClipboard() {
    navigator.clipboard.writeText(projectToText()).then()
}

export function projectToStorage() {
    localStorage.setItem("project", projectToText())
}

export function projectFromStorage(texture) {
    initData()
    let text = localStorage.getItem("project")
    if(text !== null) projectFromText(text, texture)
}