import {layer, tileMap, tileSet, world} from "./project.js"
import {TileSet} from "./tile_set.js"
import {ImageArray} from "./image_array.js"
import {TileMap} from "./tile_map.js"
import {Block} from "./block.js"
import {Category, Pos, Rule} from "./auto_tiling.js"
import {texture} from "./system.js"
import {Layer} from "./layer.js"
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

    let start = pos
    while(comparison(text.charAt(pos))) {
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
    let value = getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
    return value === "true"
}

export function getInt(terminator) {
    let num = getSymbols(symbol => {
        return isDigit(symbol)
    }, terminator)
    return num === "" ? "" : parseInt(num)
}

export function getFloat(terminator) {
    let num = getSymbols(symbol => {
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

export function getIntArray(terminator) {
    if(!getSymbol("[", terminator)) return ""
    let array = []
    while(true) {
        let num = getInt("]")
        if(num === "") return array
        array.push(parseInt(num))
    }
}

export function getBooleanArray(values) {
    let array = new Array(values.length)
    for(let i = 0; i < values.length; i++) {
        array[i] = values.charAt(i) === "1"
    }
    return array
}

export function readSymbol() {
    let char = text.charAt(pos)
    pos++
    return char
}

export function eof() {
    return pos >= text.length
}



function getBlocks() {
    let array = []
    getSymbol("[")
    while(true) {
        let x = getInt("]")
        if(x === "")  {
            pos++
            return array
        }
        let y = getInt()
        let width = getInt()
        let height = getInt()
        let type = getInt()
        array.push(new Block(x, y, width, height, type))
    }
}

function getPositions() {
    let array = []
    getSymbol("[")
    while(true) {
        let dx = getInt("]")
        if(dx === "") {
            pos++
            return array
        }
        let dy = getInt()
        array.push(new Pos(dx, dy))
    }
}

function getRules() {
    let array = []
    getSymbol("[")
    while(true) {
        let tiles = getInt("]")
        if(tiles === "")  {
            pos++
            return array
        }
        let positions = getPositions()
        array.push(new Rule(tiles, positions))
    }
}

export function getCategory() {
    let name = getString()
    let rules = getRules()
    let prolong = getBoolean()
    let columns = getInt()
    return new Category(name, rules, prolong, columns)
}

export function getCategories(columns) {
    let array = []
    getSymbol("[")
    while(true) {
        let name = getString("]")
        if(name === "") {
            pos++
            return array
        }
        let rules = getRules()
        let prolong = getBoolean()
        getInt()
        array.push(new Category(name, rules, prolong, columns))
    }
}

export function getTileSet(name) {
    getSymbol(".")
    let textureName = getToken()
    let columns = getInt()
    let rows = getInt()
    let xMul = getFloat()
    let yMul = getFloat()
    let heightMul = getFloat()
    let widthMul = getFloat()
    let visibility = getIntArray()
    let blocks = getBlocks()
    let categories = getCategories(columns)
    //let prolong = getInt()
    let altTile = getInt()
    let groups = getIntArray()
    tileSet[name] = new TileSet(new ImageArray(texture[textureName], columns, rows, xMul, yMul, heightMul, widthMul)
        , visibility, blocks, categories, altTile, groups)
    getSymbol(")")
}

export function getTileMap(name, layer) {
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
    const map = new TileMap(mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array)
    if(layer === undefined) {
        tileMap[name] = map
        world.add(map)
    } else {
        layer.add(map)
    }
    getSymbol(")")
}

export function getLayer(name) {
    const l = new Layer()
    while(true) {
        if(!getSymbol("(", ")")) break
        getTileMap(undefined, l)
    }
    layer[name] = l
    setName(l, name)
    world.add(l)
}