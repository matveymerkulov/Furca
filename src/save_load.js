import {init, tileMap, tileMaps, tileSet} from "../editor/data.js"
import TileMap from "./tile_map.js"
import TileSet from "./tile_set.js"
import ImageArray from "./image_array.js"
import {objectName} from "../editor/main.js"

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

    text += "\ttileSet = {\n"
    indent = "\t\t"
    for(const set of Object.values(tileSet)) {
        text += `\t\t"${objectName.get(set)}": ${set.toString()},\n`
    }
    text += "\t}\n\n"

    text += "\ttileMap = {\n"
    for(let map of Object.values(tileMap)) {
        text += `\t\t"${objectName.get(map)}": ${map.toString()},\n`
    }
    text += "\t}\n\n"

    text += "\ttileMaps = new Layer("
    tileMaps.items.forEach(map => {
        text += `tileMap["${objectName.get(map)}"], `
    })
    text += ")\n"

    text += "}"
    return text
}



let pos, text

function getSymbol(symbol, terminator) {
    while(text.charAt(pos) !== symbol) {
        if(text.charAt(pos) === terminator) return false
        if(pos > text.length) throw new Error("file end reached")
        pos++
    }
    pos++
    return true
}

function isDigit(symbol) {
    return (symbol >= "0" && symbol <= "9") || symbol === '-'
}

function isTokenSymbol(symbol) {
    if(symbol >= "0" && symbol <= "9") return true
    if(symbol >= "A" && symbol <= "Z") return true
    if(symbol >= "a" && symbol <= "z") return true
    if(symbol === "_") return true
    return false
}

function getSymbols(comparison, terminator) {
    while(!comparison(text.charAt(pos))) {
        if(pos > text.length) throw new Error("file end reached")
        if(text.charAt(pos) === terminator) return ""
        pos++
    }

    let start = pos
    while(comparison(text.charAt(pos))) pos++

    return text.substring(start, pos)
}

function getToken(terminator) {
    return getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
}

function getInt(terminator) {
    let num = getSymbols(symbol => {
        return isDigit(symbol)
    }, terminator)
    return num === "" ? "" : parseInt(num)
}

function getFloat(terminator) {
    let num = getSymbols(symbol => {
        return isDigit(symbol) || symbol === "."
    }, terminator)
    return num === "" ? "" : parseFloat(num)
}

function getString(terminator) {
    if(getSymbol('"', terminator) === false) return ""
    return getSymbols(symbol => {
        return symbol !== '"'
    }, terminator)
}

function getIntArray() {
    getSymbol('[')
    let array = []
    while(true) {
        let num = getInt("]")
        if(num === "") return array
        array.push(parseInt(num))
    }
}

function getTileSet(texture, name) {
    getSymbol(".")
    let textureName = getToken()
    let columns = getInt()
    let rows = getInt()
    let xMul = getFloat()
    let yMul = getFloat()
    let heightMul = getFloat()
    let widthMul = getFloat()
    tileSet[name] = new TileSet(new ImageArray(texture[textureName], columns, rows, xMul, yMul, heightMul, widthMul))
}

function getTileMap(name) {
    let tileSetName = getString()
    let mapTileSet = tileSet[tileSetName]
    let columns = getInt()
    let rows = getInt()
    let x = getFloat()
    let y = getFloat()
    let cellWidth = getFloat()
    let cellHeight = getFloat()
    let array = getIntArray()
    tileMap[name] = new TileMap(mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array)
}

export function projectFromText(data, texture) {
    text = data
    pos = 0
    getSymbol("{")
    getSymbol("{")

    while(true) {
        let name = getString("}")
        if(name === "") break
        getSymbol("(")
        getTileSet(texture, name)
    }

    pos++
    while(true) {
        let name = getString("}")
        if(name === "") break
        getSymbol("(")
        getTileMap(name)
    }

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
    init()
    text = localStorage.getItem("project")
    if(text !== null) projectFromText(text, texture)
}