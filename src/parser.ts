import {imageArray, layer, tileMap, tileSet, world} from "./project.js"
import {TileSet} from "./tile_set.js"
import {ImageArray} from "./image_array.js"
import {TileMap} from "./tile_map.js"
import {Block} from "./block.js"
import {Category, Pos, Rule} from "./auto_tiling.js"
import {texture} from "./system.js"
import {Layer} from "./layer.js"
import {setName} from "./names.js"

let pos: number, text: string

export function initParser(newText: string) {
    text = newText
    pos = 0
}

export function getSymbol(symbol: string, terminator: string = undefined) {
    while(text.charAt(pos) !== symbol) {
        if(text.charAt(pos) === terminator) return false
        if(pos > text.length) throw new Error("file end reached")
        pos++
    }
    pos++
    return true
}

export function isDigit(symbol: string) {
    return (symbol >= "0" && symbol <= "9") || symbol === '-'
}

export function isTokenSymbol(symbol: string) {
    if(symbol >= "0" && symbol <= "9") return true
    if(symbol >= "A" && symbol <= "Z") return true
    if(symbol >= "a" && symbol <= "z") return true
    return symbol === "_";

}

export function getSymbols(comparison: (symbol: string) => boolean, terminator: string = undefined) {
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

export function getToken(terminator: string = undefined) {
    return getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
}

export function getBoolean(terminator: string = undefined) {
    const value = getSymbols(symbol => {
        return isTokenSymbol(symbol)
    }, terminator)
    return value === "true"
}

export function getInt(terminator: string = undefined) {
    const num = getSymbols(symbol => {
        return isDigit(symbol)
    }, terminator)
    return num === "" ? undefined : parseInt(num)
}

export function getFloat(terminator: string = undefined) {
    const num = getSymbols(symbol => {
        return isDigit(symbol) || symbol === "."
    }, terminator)
    return num === "" ? undefined : parseFloat(num)
}

export function getString(terminator: string = undefined) {
    if(getSymbol('"', terminator) === false) return ""
    return getSymbols(symbol => {
        return symbol !== '"'
    }, terminator)
}

export function getBooleanArray(values: string) {
    const array: boolean[] = []
    for(let i = 0; i < values.length; i++) {
        array.push(values.charAt(i) === "1")
    }
    return array
}

export function getIntArray(terminator: string = undefined) {
    if(!getSymbol("[", terminator)) return undefined
    const array: number[] = []
    while(true) {
        const num: number = getInt("]")
        if(num === undefined) return array
        array.push(num)
    }
}

export function getStringArray(terminator: string = undefined) {
    if(!getSymbol("[", terminator)) return undefined
    const array: string[] = []
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
    const array: Block[] = []
    getSymbol("[")
    while(true) {
        const x = getInt("]")
        if(x === undefined)  {
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
        if(dx === undefined) {
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
        if(tiles === undefined)  {
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

export function getCategories(columns: number) {
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
    imageArray.set(name, new ImageArray(texture.get(textureName), columns, rows, xMul, yMul, heightMul, widthMul))
    getSymbol(")")
}

export function getTileSet() {
    getSymbol(".")
    const name = getToken()
    getSymbol(".")
    const array = imageArray.get(getToken())
    const visibility = getIntArray()
    const blocks = getBlocks()
    const categories = getCategories(array.columns)
    //const prolong = getInt()
    const altTile = getInt()
    const groups = getIntArray()
    tileSet.set(name, new TileSet(array, visibility, blocks, categories, altTile, groups))
    getSymbol(")")
}

export function getTileMap(layer: Layer = undefined) {
    const name = getToken()
    getSymbol(".")
    const tileSetName = getToken()
    const mapTileSet = tileSet.get(tileSetName)
    const columns = getInt()
    const rows = getInt()
    const x = getFloat()
    const y = getFloat()
    const cellWidth = getFloat()
    const cellHeight = getFloat()
    const array = getIntArray()
    const map = new TileMap(mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array)
    if(layer === undefined) {
        tileMap.set(name, map)
        world.add(map)
    } else {
        layer.add(map)
    }
    getSymbol(")")
}

export function getLayer() {
    let name = getToken()
    getSymbol("(")

    const l = new Layer()
    while(true) {
        if(!getSymbol("(", ")")) break
        getTileMap(l)
    }
    layer.set(name, l)
    setName(l, name)
    world.add(l)
}