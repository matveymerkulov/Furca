import {tileMap, tileMaps, tileSet} from "../editor/data.js"
import TileMap from "./tile_map.js"
import TileSet from "./tile_set.js"
import ImageArray from "./image_array.js"

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
    for(let pos = 0; pos < array.length; pos++) {
        if(columns !== undefined && (pos % columns) === 0) {
            text +="\n\t\t\t"
        }
        text += array[pos].toString().padStart(3, " ") + ","
    }
    return `[${text}\n]`
}

export function projectToText() {
    let text = ""
    text += `export function loadData(texture) {\n`

    text += "\ttileSet = {\n"
    for(const set of Object.values(tileSet)) {
        text += `\t\t${set.name}: ${set.toString()},\n`
    }
    text += "\t}\n\n"

    text += "\ttileMap = {\n"
    for(const map of Object.values(tileMap)) {
        text += `\t\t${map.name}: ${map.toString()},\n`
    }
    text += "\t}\n"

    text += "\ttileMaps = new Layer("
    tileMaps.forEach(map => {
        text += `tileMap.${map.name},`
    })
    text += ")\n"

    text += "}"
    return text
}



let pos, text

function getSymbol(symbol) {
    while(text.charAt(pos) !== symbol) {
        pos++
    }
    pos++
}

function isDigit(symbol) {
    return symbol >= "0" && symbol <= "9"
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

function getString() {
    getSymbol('"')
    return getSymbols(symbol => {
        return symbol !== '"'
    })
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

function getTileSet(texture) {
    let name = getString()
    getSymbol(".")
    let textureName = getToken()
    let columns = getInt()
    let rows = getInt()
    let xMul = getFloat()
    let yMul = getFloat()
    let heightMul = getFloat()
    let widthMul = getFloat()
    tileSet[name] = new TileSet(name, new ImageArray(texture[textureName], columns, rows, xMul, yMul, heightMul, widthMul))
}

function getTileMap() {
    let name = getString()
    getSymbol(".")
    let tileSetName = getToken()
    let mapTileSet = tileSet[tileSetName]
    let columns = getInt()
    let rows = getInt()
    let x = getFloat()
    let y = getFloat()
    let cellWidth = getFloat()
    let cellHeight = getFloat()
    let array = getIntArray()
    tileMap[name] = new TileMap(name, mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array)
}

export function projectFromText(data, texture) {
    text = data
    pos = 0
    getSymbol("{")
    getSymbol("{")

    while(getToken("}") !== "") {
        getSymbol("(")
        getTileSet(texture)
    }

    pos++
    while(getToken("}") !== "") {
        getSymbol("(")
        getTileMap()
    }

    getSymbol("(")
    while(getToken("}") !== "") {
        getSymbol("(")
        getSymbol(".")
        tileMaps.add(tileMap[name])
    }
}

export function projectToClipboard() {
    navigator.clipboard.writeText(projectToText()).then()
}

export function projectToStorage() {
    localStorage.setItem("project", projectToText())
}

export function projectFromStorage(texture) {
    text = localStorage.getItem("project")
    if(text !== null) projectFromText(text, texture)
}