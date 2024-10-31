import {TileMap} from "../src/tile_map.js"
import {layer, tileMap, world} from "../src/project.js"
import {eof, getInt, getSymbol, getToken, initParser, readSymbol} from "../src/parser.js"
import {setName} from "../src/names.js"
import {Layer} from "../src/layer.js"

export function addObject(name, object) {
    setName(object, name)
    if(object instanceof Layer) {
        layer[name] = object
    } else {
        tileMap[name] = object
    }
    world.add(object)
}

export function createTileMap(string, set, columns, rows, cornerX, cornerY) {
    function newMap(name, x, y) {
        addObject(name, new TileMap(set, columns, rows, x, y, 1, 1))
    }

    let fromX = 0, toX = 0, fromY = 0, toY = 0

    let template = ""
    initParser(string)
    while(!eof()) {
        let sym = readSymbol()
        if(sym === "\\") {
            getSymbol("(")
            let variable = getToken()
            getSymbol("=")
            let from = getInt()
            getSymbol(".")
            getSymbol(".")
            let to = getInt()
            getSymbol(")")

            switch(variable) {
                case "x":
                    fromX = from
                    toX = to
                    template += "\\x"
                    break
                case "y":
                    fromY = from
                    toY = to
                    template += "\\y"
                    break
                default:
                    throw new Error("Invalid variable name")
            }
        } else {
            template += sym
        }
    }

    for(let y = fromY; y <= toY; y++) {
        for(let x = fromX; x <= toX; x++) {
            let name = template.replace("\\x", "" + x).replace("\\y", "" + y)
            newMap(name, cornerX + (x - fromX) * (columns + 1), cornerY + (y - fromY) * (rows + 1))
        }
    }
}