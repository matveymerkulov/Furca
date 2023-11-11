import {project} from "../../src/project.js"
import TileMap from "../../src/tilemap.js"
import ImageArray from "../../src/image_array.js"
import {apsk} from "../../src/system.js"
import Key, {key} from "../../src/key.js"
import Sprite from "../../src/sprite.js"
import {ShapeType} from "../../src/shape_type.js"
import Layer from "../../src/layer.js"

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
let jumpdy = -9.1
let horizontalAcceleration = 20
let maxHorizontalAcceleration = 5
let panelSpeed = 3

let emptyTile = 0
let keyTile = 1
let playerTile = 7
let diamondTile = 8
let panelTile = 9
let bombTile = 12
let figureTile = 13

project.init = (texture) => {
    //let tileMap = tilemapFromImage(texture.levels, 16, 16, 16, 0, 0, 1, 1)
    let tileMap = new TileMap(new ImageArray(texture.tiles, 16, 1), 13, 12, 0, 0, 1, 1)
    tileMap.array = [0,0,0,1,0,0,0,0,0,2,3,4,0,0,0,0,0,0,0,0,0,0,5,6,0,0,0,0,0,0,0,0,0,0,0,2,6,0,0,0,0,0,0,0,0,0,0
        ,0,5,3,0,0,7,0,0,0,0,8,0,9,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,5,3,0,0,0,0,0,10,0,0,0,5,3,2,6,0,0,0
        ,0,0,11,0,0,0,2,6,5,3,0,0,0,0,0,0,0,0,0,2,3,5,6,12,0,0,0,0,13,0,10,14,5,3,2,6,10,14,0,0,0,10,0,11,15,2,6,5,3
        ,11,15,0,0,0,11]
    tileMap.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 2)
    tileMap.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.circle)
        , [keyTile, diamondTile, bombTile, figureTile])

    let player = tileMap.extract(playerTile, ShapeType.circle)
    player.dx = 0
    player.dy = 0
    player.size = 0.99

    project.background = "blue"

    function onGround() {
        if(player.dy < 0) {
            player.dy = 0
            return
        }
        player.dy = 0
        if(project.key.jump.isDown) {
            player.dy = jumpdy
        }
    }

    function tileCollision(shape, tileNum, x, y) {
        switch(tileNum) {
            case keyTile:
            case bombTile:
            case figureTile:
            case diamondTile:
                tileMap.setTile(x, y, emptyTile)
                break
            default:
                player.pushFromSprite(shape)
                break
        }
    }

    let panels = new Layer()

    tileMap.processTiles((column, row, tileNum) => {
        if(tileNum === panelTile) {
            let panel = tileMap.extractTile(column, row, ShapeType.box)
            panel.dy = -panelSpeed
            panels.add(panel)
        }
    })

    project.scene.add(tileMap, player, panels)

    function horizontalMovement(object, leftKey, rightKey, acceleration, maxAcceleration) {
        if(leftKey.isDown) {
            object.dx = Math.max(-maxAcceleration, player.dx - acceleration * apsk)
            object.flipped = true
        }

        if(rightKey.isDown) {
            object.dx = Math.min(maxAcceleration, player.dx + acceleration * apsk)
            object.flipped = false
        }
    }

    project.update = () => {
        player.dy += gravity * apsk
        player.centerY += player.dy * apsk

        if(!tileMap.overlaps(player)) {
            onGround()
            player.limit(tileMap)
        }

        tileMap.collisionWithSprite(player, (shape, tileNum, x, y) => {
            tileCollision(shape, tileNum, x, y)
            onGround()
        })

        for(let panel of panels.items) {
            panel.centerY += panel.dy * apsk
            if(!tileMap.overlaps(panel)) {
                panel.dy = -panel.dy
                panel.limit(tileMap)
            }

            if(panel.collidesWithSprite(player)) {
                player.pushFromSprite(panel)
            }

            tileMap.collisionWithSprite(panel, (shape, tileNum, x, y) => {
                panel.pushFromSprite(shape)
                panel.dy = -panel.dy
            })
        }

        horizontalMovement(player, project.key.left, project.key.right, horizontalAcceleration, maxHorizontalAcceleration)

        player.centerX += player.dx * apsk

        if(!tileMap.overlaps(player)) {
            player.dx = 0
            player.limit(tileMap)
        }

        tileMap.collisionWithSprite(player, (shape, tileNum, x, y) => {
            tileCollision(shape, tileNum, x, y)
            player.dx = 0
        })

        for(let panel of panels.items) {
            if(panel.collidesWithSprite(player)) {
                player.pushFromSprite(panel)
                player.dx = 0
            }
        }
    }
}