import TileSet from "../src/tile_set.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import Layer from "../src/layer.js"

export let tileSet = {}, tileMap = {}, tileMaps

export function loadData(texture) {
    tileSet = {
        floor: new TileSet("floor",new ImageArray(texture.floor,9,11,0.5,0.5,1,1)),
        objects: new TileSet("objects",new ImageArray(texture.objects,10,17,0.5,0.5,1,1)),
    }

    tileMap = {
        floor: new TileMap("floor",tileSet.floor,16,16,0,0,1,1,[
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0, 68, 68, 68, 68, 68, 68, 68, 68, 68,  0,  0,  0,
            0,  0,  0, 68, 68,  0,  0,  0,  0,  0,  0,  0, 68, 68,  0,  0,
            0, 68, 68,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 68,  0,  0,
            0, 68,  0,  0,  0,  0,  0,  0,  1,  1,  0,  0, 68, 68,  0,  0,
            0, 68, 70,  0,  0,  0,  0,  1, 17, 17, 17,  1,  0, 63, 63,  0,
            0, 68, 68,  0,  0,  0,  1, 17, 17,  1,  1,  1,  0, 63, 63,  0,
            68, 68, 68,  0,  0,  0,  1, 17, 17, 17, 17,  1,  0, 63, 63,  0,
            67, 68,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0, 63, 63,  0,
            65, 68,  0,  0,  0,  0,  1,  1,  1,  1,  1,  1,  0,  0,  0,  0,
            69, 69,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0, 68,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0, 68,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ]),
        objects: new TileMap("objects",tileSet.objects,16,16,0,0,1,1,[
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0, 26,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0, 26, 26,  0,  0,  0, 26,  0,  0,  0,  0,
            0,  0,  0,  0, 23, 23, 23,  0, 26, 26, 26, 23,  0,  0,  0,  0,
            0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0, 23,  0,  0, 20, 20, 20, 20,  0,  0,  0,  0,  0,
            0,  0,  0,  0, 23,  0,  0, 30, 30, 30, 30,  0,  0,  0,  0,  0,
            0,  0,  0,  0, 23, 23,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0, 23, 23, 23, 23,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        ]),
    }

    tileMaps = new Layer(tileMap.floor, tileMap.objects)
}