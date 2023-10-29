import {project} from "../../project.js"
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
            tiles: "tiles.png",
            level: "screens/01.png",
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    let tileMap = tilemapFromImage(texture.level, 16, 16, 16, 0, 0, 1, 1)

    project.background = "blue"

    project.scene = [
        tileMap,
    ]

    project.actions = [
    ]

    let angle = 0
    project.update = () => {
        tileMap.leftX = Math.cos(angle) - 6.5
        tileMap.topY = Math.sin(angle) - 6
        angle += 0.01
    }
}