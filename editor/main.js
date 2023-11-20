import {project} from "../src/project.js"
import Canvas, {currentCanvas, setCanvas} from "../src/canvas.js"
import TileMap from "../src/tilemap.js"
import ImageArray from "../src/image_array.js"
import {Layer} from "../src/index.js"

project.getAssets = () => {
    return {
        texture: {
            tiles: "tiles.png",
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    project.background = "rgb(9, 44, 84)"

    let tileMap = new TileMap(new ImageArray(texture.tiles, 16, 21), 13, 12, 0, 0, 1, 1)
    tileMap.array = [0,0,0,1,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,5,6,0,0,0,0,0,0,0,0,0,0,0,2,6,0,0,0,0,0,0,0,0,0,0
        ,0,5,3,0,0,7,0,0,0,0,8,0,9,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,5,3,0,0,0,0,0,10,0,0,0,5,3,2,6,0,0,0
        ,0,0,11,0,0,0,2,6,5,3,0,0,0,0,0,0,0,0,0,2,3,5,6,12,0,0,0,0,13,0,10,14,5,3,2,6,10,14,0,0,0,10,0,11,15,2,6,5,3
        ,11,15,0,0,0,11]

    let map = Canvas.create(document.getElementById("map"), new Layer(tileMap), 30, 14)
    let tiles = Canvas.create(document.getElementById("tiles"), new Layer(), 8, 14)
    setCanvas(map)

    project.update = () => {
        map.draw()
    }
}