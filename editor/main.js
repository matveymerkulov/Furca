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
    tileMap.array = [0,0,0,42,0,0,0,0,0,98,99,16,0,0,0,0,0,0,0,0,0,0,114,115,0,0,0,0,0,0,0,0,0,0,0,98,115,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,1,0,0,0,0,64,0,241,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,0,0,0,100,0,0,0,114,99,98,115,0,0,0,0,0,116,0,0,0,98,115,114,99,0,0,0,0,0,0,0,0,0,98,99,114,115,57,0,0,0,0,51,0,100,101,114,99,98,115,100,101,0,0,0,100,0,116,117,98,115,114,99,116,117,0,0,0,116]

    let map = Canvas.create(document.getElementById("map"), new Layer(tileMap), 30, 14)
    let tiles = Canvas.create(document.getElementById("tiles"), new Layer(), 8, 14)
    setCanvas(map)

    project.update = () => {
        map.draw()
    }
}