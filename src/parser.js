import {TileSet} from "./tile_set.js"
import {TextureArray} from "./texture_array.js"
import {TileMap} from "./tile_map.js"
import {Block} from "./block.js"
import {Category, Pos, Rule} from "./auto_tiling.js"
import {Container} from "./container.js"
import {setName} from "./names.js"

let pos, text

export function initParser(newText) {
    text = newText
    pos = 0
}

export function getSymbol(symbol, terminator) {
    while(text.charAt(pos) !== symbol) {
        if(text.charAt(pos) === terminator) return false
        if(pos > text.length) throw new Error("file end reached")
        pos++
    }
    pos++
    return true
}

export function isDigit(symbol) {
    return (symbol >= "0" && symbol <= "9") || symbol === '-'
}

export function isTokenSymbol(symbol) {
    if(symbol >= "0" && symbol <= "9") return true
    if(symbol >= "A" && symbol <= "Z") return true
    if(symbol >= "a" && symbol <= "z") return true
    return symbol === "_";

}

export function getSymbols(comparison, terminator) {
    while(!comparison(text.charAt(pos))) {
        if(pos > text.length) throw new Error("file end reached")
        if(text.charAt(pos) === terminator) return ""
        pos++
    }

    const start = pos
    while(comparison(text.charAt(pos))) {
        if(pos > text.length) throw new Error("file end reached")
        pos++
    }

    return text.substring(start, pos)
}

export function getToken(terminator) {
    return getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
}

export function getBoolean(terminator) {
    const value = getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
    return value === "true"
}

export function getInt(terminator) {
    const num = getSymbols(symbol => {
        return isDigit(symbol)
    }, terminator)
    return num === "" ? "" : parseInt(num)
}

export function getFloat(terminator) {
    const num = getSymbols(symbol => {
        return isDigit(symbol) || symbol === "."
    }, terminator)
    return num === "" ? "" : parseFloat(num)
}

export function getString(terminator) {
    if(getSymbol('"', terminator) === false) return ""
    return getSymbols(symbol => {
        return symbol !== '"'
    }, terminator)
}

export function getBooleanArray(values) {
    const array = new Array(values.length)
    for(let i = 0; i < values.length; i++) {
        array[i] = values.charAt(i) === "1"
    }
    return array
}

export function getIntArray(terminator) {
    if(!getSymbol("[", terminator)) return ""
    const array = []
    while(true) {
        const num = getInt("]")
        if(num === "") return array
        array.push(parseInt(num))
    }
}

export function getStringArray(terminator) {
    if(!getSymbol("[", terminator)) return ""
    const array = []
    while(true) {
        const string = getString("]")
        if(string === "") return array
        array.push(string)
        pos++
    }
}

export function readSymbol() {
    const char = text.charAt(pos)
    pos++
    return char
}

export function eof() {
    return pos >= text.length
}



function getBlocks() {
    const array = []
    getSymbol("[")
    while(true) {
        const x = getInt("]")
        if(x === "")  {
            pos++
            return array
        }
        const y = getInt()
        const width = getInt()
        const height = getInt()
        const type = getInt()
        array.push(new Block(x, y, width, height, type))
    }
}

function getPositions() {
    const array = []
    getSymbol("[")
    while(true) {
        const dx = getInt("]")
        if(dx === "") {
            pos++
            return array
        }
        const dy = getInt()
        array.push(new Pos(dx, dy))
    }
}

function getRules() {
    const array = []
    getSymbol("[")
    while(true) {
        const tiles = getInt("]")
        if(tiles === "")  {
            pos++
            return array
        }
        const positions = getPositions()
        array.push(new Rule(tiles, positions))
    }
}

export function getCategory() {
    const name = getString()
    const rules = getRules()
    const prolong = getBoolean()
    const columns = getInt()
    return new Category(name, rules, prolong, columns)
}

export function getCategories(columns) {
    const array = []
    getSymbol("[")
    while(true) {
        const name = getString("]")
        if(name === "") {
            pos++
            return array
        }
        const rules = getRules()
        const prolong = getBoolean()
        getInt()
        array.push(new Category(name, rules, prolong, columns))
    }
}

export function getImageArray() {
    const name = getToken()
    getSymbol(".")
    const textureName = getToken()
    const columns = getInt()
    const rows = getInt()
    const xMul = getFloat()
    const yMul = getFloat()
    const heightMul = getFloat()
    const widthMul = getFloat()
    imageArray[name] = new TextureArray(texture[textureName], columns, rows, xMul, yMul, heightMul, widthMul)
    let t = text.substring(0, pos)
    getSymbol(")")
}

export function getTileSet() {
    getSymbol(".")
    const name = getToken()
    getSymbol(".")
    const array = imageArray[getToken()]
    const visibility = getIntArray()
    const blocks = getBlocks()
    const categories = getCategories(imageArray.columns)
    //const prolong = getInt()
    const altTile = getInt()
    const groups = getIntArray()
    tileSet[name] = new TileSet(array, visibility, blocks, categories, altTile, groups)
    getSymbol(")")
}

export function getTileMap(layer) {
    const name = getToken()
    getSymbol(".")
    const tileSetName = getToken()
    const mapTileSet = tileSet[tileSetName]
    const columns = getInt()
    const rows = getInt()
    const x = getFloat()
    const y = getFloat()
    const cellWidth = getFloat()
    const cellHeight = getFloat()
    const array = getIntArray()
    const map = new TileMap(mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array)
    if(layer === undefined) {
        tileMap[name] = map
        world.add(map)
    } else {
        layer.add(map)
    }
    getSymbol(")")
}

export function getLayer() {
    let name = getToken()
    getSymbol("(")

    const l = new Container()
    while(true) {
        if(!getSymbol("(", ")")) break
        getTileMap(l)
    }
    layer[name] = l
    setName(l, name)
    world.add(l)
}