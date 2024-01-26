import TileSet from "../src/tile_set.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import {setScene, setTileMaps, setTileSets, tileMap, tileMaps, tileSet} from "../src/project.js"
import Layer from "../src/layer.js"

export function loadData(texture) {
    setTileSets({
        "floor": new TileSet(new ImageArray(texture.floor, 9, 11, 0.5, 0.5, 1, 1)),
        "objects": new TileSet(new ImageArray(texture.objects, 10, 17, 0.5, 0.5, 1, 1)),
        "blocks": new TileSet(new ImageArray(texture.blocks, 2, 1, 0.5, 0.5, 1, 1)),
    })

    setTileMaps({
    })

    setScene(new Layer())
}