import {TileMap} from "../src/tile_map.js"
import {tileMap, world} from "../src/project.js"
import {eof, getInt, getSymbol, getToken, initParser, readSymbol} from "../src/parser.js"
import {setName} from "../src/names.js"

export function addTileMap(name, map) {
    setName(map, name)
    tileMap[name] = map
    world.add(map)
}

export function createTileMap(string, set, columns, rows, cornerX, cornerY) {
    function newMap(name, x, y) {
        addTileMap(name, new TileMap(set, columns, rows, x, y, 1, 1))
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