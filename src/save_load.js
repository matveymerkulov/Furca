import {tileMap, tileSet} from "../editor/data.js"

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

export function arrayToString(array) {
    let text = ""
    for(let item of array) {
        text += item + ","
    }
    return `[${text}]`
}

export function saveProject() {
    let text = ""
    text += `import TileSet from "../src/tile_set.js"\n`
    text += `import {ImageArray, TileMap} from "../src/index.js"\n\n`
    text += `export let tileSet, tileMap\n\n`
    text += `export function loadData(texture) {\n`

    text += "\ttileSet = {\n"
    for(const set of Object.values(tileSet)) {
        text += `\t\t${set.name}: ${set.toString()},\n`
    }
    text += "}\n\n"

    text += "\ttileMap = {\n"
    for(const map of Object.values(tileMap)) {
        text += `\t\t${map.name}: ${map.toString()},\n`
    }
    text += "\t}\n"

    text += "}"

    navigator.clipboard.writeText(text).then()
}