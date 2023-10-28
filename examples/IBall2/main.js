import {project} from "../../project.js"
import ImageArray from "../../image_array.js"
import TileMap from "../../tilemap.js"
import {rndi} from "../../system.js"
import {tilemapFromImage} from "../../utils/tilemap_from_image.js"

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
    tilemapFromImage("screens/01.png", 16, 16, 16)

    let tiles = new ImageArray(texture.tiles, 16, 25)
    let tileMap = new TileMap(tiles, 10, 10, -5, -5, 1, 1)
    for(let i = 0; i < tileMap.map.array.length; i++) {
        tileMap.map.array[i] = rndi(tiles._images.length)
    }

    project.background = "black"

    project.scene = [
        tileMap,
    ]

    project.actions = [
    ]

    let angle = 0
    project.update = () => {
        tileMap.leftX = Math.cos(angle) - 5
        tileMap.topY = Math.sin(angle) - 5
        angle += 0.01
    }
}