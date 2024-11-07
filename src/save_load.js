//import {initData, tileMap, tileMaps, tileSet} from "./project.js"
//import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"
//import {getName} from "./names.js"

import {imageArray, project, tileMap, tileSet, world} from "./project.js"
import {getName} from "./names.js"
import {
    getImageArray,
    getLayer,
    getString,
    getStringArray,
    getSymbol,
    getTileMap,
    getTileSet,
    getToken,
    initParser
} from "./parser.js"
import {TileMap} from "./tile_map.js"
import {loadTexture} from "./system.js"

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
    const path = "../Furca/src"

    let text = ""
    text += `import {TileSet} from "${path}/tile_set.js"\n`
    text += `import {TileMap} from "${path}/tile_map.js"\n`
    text += `import {ImageArray} from "${path}/image_array.js"\n`
    text += `import {layer, tileMap, tileSet, project} from "${path}/project.js"\n`
    text += `import {Block} from "${path}/block.js"\n`
    text += `import {Category, Pos, Rule} from "${path}/auto_tiling.js"\n`
    text += `import {texture} from "${path}/system.js"\n`
    text += `import {Layer} from "${path}/layer.js"\n\n`

    text += `project.texturePath = ${project.texturePath}\n`
    text += `project.textures = [`
    const textureSet = new Set()
    for(let set of Object.values(tileSet)) {
        const tex = set.images.texture
        if(textureSet.has(tex)) continue
        text += `"${tex.fileName}", `
    }

    text += ']\n\nexport function loadData() {\n'

    indent = "\t"

    for(const[name, images] of Object.entries(imageArray)) {
        text += `\timageArray.${name} = ${images.toString()}\n`
    }
    text += "\n"

    for(const[name, set] of Object.entries(tileSet)) {
        text += `\ttileSet.${name} = ${set.toString()}\n`
    }
    text += "\t\n"

    for(let object of world.items) {
        text += `\t${object instanceof TileMap ? "tileMap" : "layer"}.${getName(object)} = ${object.toString()}\n`
    }

    return text + "}"
}

export function loadTextures(data, func) {
    initParser(data)
    getSymbol("=")
    project.texturePath = getString()
    getSymbol("=")
    project.textures = getStringArray()
    for(const textureFileName of project.textures) {
        loadTexture(textureFileName, func)
    }
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
                getTileSet()
                break
            case "tileMap":
                getTileMap()
                break
            case "imageArray":
                getImageArray()
                break
            case "layer":
                getLayer()
                break
            default:
                console.log("Wrong token " + token)
        }
    }
}