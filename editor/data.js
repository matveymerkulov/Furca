import TileSet from "../src/tile_set.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import Layer from "../src/layer.js"

export let tileSet, tileMap, tileMaps

export function init() {
    tileSet = {}
    tileMap = {}
    tileMaps = new Layer()
}

export function loadData(texture) {
    tileSet = {
        "floor": new TileSet(new ImageArray(texture.floor, 9, 11, 0.5, 0.5, 1, 1)),
        "objects": new TileSet(new ImageArray(texture.objects, 10, 17, 0.5, 0.5, 1, 1)),
        "blocks": new TileSet(new ImageArray(texture.blocks, 2, 1, 0.5, 0.5, 1, 1)),
    }

    tileMap = {
        "0-0": new TileMap(tileSet.blocks, 4, 4, -3, -4, 1, 1, [
            0,  0,  0,  0,
            0,  0,  0,  0,
            0,  0,  0,  0,
            0,  0,  0,  0,
        ], -1),
    }

    tileMaps = new Layer(tileMap["0-0"], )
}