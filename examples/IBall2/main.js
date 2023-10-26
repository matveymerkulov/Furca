import {project} from "../../project.js"
import ImageArray from "../../image_array.js"
import TileMap from "../../tilemap.js"
import {rndi} from "../../system.js"

project.locales.en = {
}

project.locales.ru = {
}

project.key = {
}

project.getAssets = () => {
    return {
        texture: {
            tiles: "tiles.png"
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    let tiles = new ImageArray(texture.tiles, 16, 25)
    let tileMap = new TileMap(tiles, 10, 10, -5, -5, 1, 1)
    for(let i = 0; i < tileMap.map.array.length; i++) {
        tileMap.map.array[i] = rndi(tiles._images.length)
    }

    project.scene = [
        tileMap,
    ]

    project.actions = [
    ]

    project.update = () => {

    }
}