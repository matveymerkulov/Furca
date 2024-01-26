import {initData, tileMap, tileMaps, tileSet} from "../src/project.js"
import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser, readSymbol} from "../src/parser.js"
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

export function arrayToString(array, columns) {
    let text = ""
    addIndent()
    for(let pos = 0; pos < array.length; pos++) {
        if(columns !== undefined && (pos % columns) === 0) {
            text +=`\n${indent}`
        }
        text += array[pos].toString().padStart(3, " ") + ","
    }
    removeIndent()
    return `[${text}\n${indent}]`
}

export function projectToText() {
    let text = ""
    text += `export function loadData(texture) {\n`

    text += "\tsetTileSets({\n"
    indent = "\t\t"
    for(const set of Object.values(tileSet)) {
        text += `\t\t"${getName(set)}": ${set.toString()},\n`
    }
    text += "\t})\n\n"

    text += "\tsetTileMaps({\n"
    for(let map of tileMaps.items) {
        text += `\t\t"${getName(map)}": ${map.toString()},\n`
    }
    text += "\t})\n\n"

    text += "\ttileMaps = new Layer("
    tileMaps.items.forEach(map => {
        text += `tileMap["${getName(map)}"], `
    })
    text += ")\n"

    text += "}"
    return text
}

export function projectFromText(data, texture) {
    initParser(data)
    getSymbol("{")
    getSymbol("{")

    while(true) {
        let name = getString("}")
        if(name === "") break
        getSymbol("(")
        getTileSet(texture, name)
    }
    readSymbol()

    readSymbol()
    while(true) {
        let name = getString("}")
        if(name === "") break
        getSymbol("(")
        getTileMap(name)
    }
    readSymbol()

    getSymbol("(")
    while(getToken(")") !== "") {
        getSymbol("[")
        tileMaps.add(tileMap[getString()])
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