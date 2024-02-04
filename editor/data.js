import TileSet from "../src/tile_set.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import {tileMap, tileMaps, tileSet} from "../src/project.js"
import {getBooleanArray} from "../src/parser.js"

export function loadData(texture) {
    tileSet["floor"] = new TileSet(new ImageArray(texture.floor, 9, 11, 0.5, 0.5, 1, 1), getBooleanArray("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"))
    tileSet["objects"] = new TileSet(new ImageArray(texture.objects, 10, 17, 0.5, 0.5, 1, 1), getBooleanArray("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"))
    tileSet["blocks"] = new TileSet(new ImageArray(texture.blocks, 2, 1, 0.5, 0.5, 1, 1), getBooleanArray("00"))

    tileMap["0-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, -10, 1, 1, [
        0,  0,  0,  0,
        1,  1,  1,  1,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["1-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, -5, 1, 1, [
        0,  0,  0,  0,
        1,  1,  1,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["2-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 0, 1, 1, [
        1,  1,  0,  0,
        0,  1,  1,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["3-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 5, 1, 1, [
        0,  1,  1,  0,
        1,  1,  0,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["4-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 10, 1, 1, [
        1,  1,  0,  0,
        0,  1,  0,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["5-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 15, 1, 1, [
        0,  1,  1,  0,
        0,  1,  0,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["6-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 20, 1, 1, [
        1,  1,  0,  0,
        1,  1,  0,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["0-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, -10, 1, 1, [
        0,  1,  0,  0,
        0,  1,  0,  0,
        0,  1,  0,  0,
        0,  1,  0,  0,
    ], -1)
    tileMap["1-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, -5, 1, 1, [
        0,  1,  0,  0,
        1,  1,  0,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["1-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, -5, 1, 1, [
        0,  1,  0,  0,
        1,  1,  1,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["1-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, -5, 1, 1, [
        0,  1,  0,  0,
        0,  1,  1,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["2-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 0, 1, 1, [
        0,  0,  1,  0,
        0,  1,  1,  0,
        0,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["3-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 5, 1, 1, [
        0,  1,  0,  0,
        0,  1,  1,  0,
        0,  0,  1,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["4-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 10, 1, 1, [
        0,  0,  1,  0,
        1,  1,  1,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["4-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, 10, 1, 1, [
        0,  1,  0,  0,
        0,  1,  0,  0,
        0,  1,  1,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["4-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, 10, 1, 1, [
        0,  0,  0,  0,
        1,  1,  1,  0,
        1,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["5-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 15, 1, 1, [
        0,  0,  0,  0,
        1,  1,  1,  0,
        0,  0,  1,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["5-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, 15, 1, 1, [
        0,  1,  0,  0,
        0,  1,  0,  0,
        1,  1,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["5-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, 15, 1, 1, [
        1,  0,  0,  0,
        1,  1,  1,  0,
        0,  0,  0,  0,
        0,  0,  0,  0,
    ], -1)
    tileMap["field"] = new TileMap(tileSet["blocks"], 16, 24, 8, 0, 1, 1, [
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,
        0,  0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    ], -1)

    tileMaps.add(tileMap["0-0"], tileMap["1-0"], tileMap["2-0"], tileMap["3-0"], tileMap["4-0"], tileMap["5-0"], tileMap["6-0"], tileMap["0-1"], tileMap["1-1"], tileMap["1-2"], tileMap["1-3"], tileMap["2-1"], tileMap["3-1"], tileMap["4-1"], tileMap["4-2"], tileMap["4-3"], tileMap["5-1"], tileMap["5-2"], tileMap["5-3"], tileMap["field"], )
}