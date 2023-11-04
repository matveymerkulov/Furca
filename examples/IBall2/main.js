import {project} from "../../project.js"
import TileMap from "../../tilemap.js"
import ImageArray from "../../image_array.js"
import {apsk} from "../../system.js"
import Key, {key} from "../../key.js"

project.getAssets = () => {
    return {
        texture: {
            tiles: "tiles.png",
            levels: "screens/all.png",
        },
        sound: {
        }
    }
}

project.key = {
    left: new Key("KeyA"),
    right: new Key("KeyD"),
    jump: new Key("KeyW"),
}

let gravity = 10
let jumpdy = -10
let horizontalAcceleration = 10
let maxHorizontalAcceleration = 5

project.init = (texture) => {
    //let tileMap = tilemapFromImage(texture.levels, 16, 16, 16, 0, 0, 1, 1)
    let tileMap = new TileMap(new ImageArray(texture.tiles, 16, 1), 13, 12, 0, 0, 1, 1)
    tileMap.array = [0,0,0,1,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,5,6,0,0,0,0,0,0,0,0,0,0,0,2,6,0,0,0,0,0,0,0,0,0,0
        ,0,5,3,0,0,7,0,0,0,0,8,0,9,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,5,3,0,0,0,0,0,10,0,0,0,5,3,2,6,0,0,0
        ,0,0,11,0,0,0,2,6,5,3,0,0,0,0,0,0,0,0,0,2,3,5,6,12,0,0,0,0,13,0,10,14,5,3,2,6,10,14,0,0,0,10,0,11,15,2,6,5,3
        ,11,15,0,0,0,11]

    let player = tileMap.extract(7)
    player.dx = 0
    player.dy = 0

    project.background = "blue"

    project.scene = [
        tileMap,
        player,
    ]

    project.actions = [
    ]

    project.update = () => {
        player.dy += gravity * apsk
        player.centerY += player.dy * apsk
        if(!tileMap.overlaps(player)) {
            player.dy = 0
            if(project.key.jump.isDown) {
                player.dy = jumpdy
            }
        }
        player.limit(tileMap)

        if(project.key.left.isDown) {
            player.dx = Math.max(-maxHorizontalAcceleration, player.dx - horizontalAcceleration * apsk)
        }

        if(project.key.right.isDown) {
            player.dx = Math.min(maxHorizontalAcceleration, player.dx + horizontalAcceleration * apsk)
        }
        player.centerX += player.dx * apsk

        if(!tileMap.overlaps(player)) {
            player.dx = 0
            player.limit(tileMap)
        }
    }
}