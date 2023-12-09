import {project} from "../../src/project.js"
import TileMap from "../../src/tilemap.js"
import ImageArray from "../../src/image_array.js"
import {apsk, defaultCanvas} from "../../src/system.js"
import Key from "../../src/key.js"
import Sprite from "../../src/sprite.js"
import {ShapeType} from "../../src/shape_type.js"
import Layer from "../../src/layer.js"
import {currentCanvas} from "../../src/index.js"
import {tilemapFromImage} from "../../src/utils/tilemap_from_image.js"

project.getAssets = () => {
    return {
        texture: {
            tiles: "new_tiles.png",
            levels: "screens/02.png",
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
let keyTile = 42
let playerTile = 1
let diamondTile = 64
let panelTile = 241
let bombTile = 57
let figureTile = 51

project.init = (texture) => {
    //let tileMap = tilemapFromImage(texture.levels, texture.tiles, 16, 16, 16, 0, 0, 1, 1)
    let tileMap = new TileMap(new ImageArray(texture.tiles, 16, 21), 13, 12, 0, 0, 1, 1)
    tileMap.array = [0,0,0,42,0,0,0,0,0,98,99,16,0,0,0,0,0,0,0,0,0,0,114,115,0,0,0,0,0,0,0,0,0,0,0,98,115,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,1,0,0,0,0,64,0,241,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,0,0,0,100,0,0,0,114,99,98,115,0,0,0,0,0,116,0,0,0,98,115,114,99,0,0,0,0,0,0,0,0,0,98,99,114,115,57,0,0,0,0,51,0,100,101,114,99,98,115,100,101,0,0,0,100,0,116,117,98,115,114,99,116,117,0,0,0,116]
    //tileMap.array = [0,96,97,0,0,0,0,0,0,0,96,97,0,41,112,113,0,0,0,0,0,0,0,112,113,65,257,257,257,257,0,0,0,0,0,257,257,257,257,0,0,0,0,257,0,0,0,257,0,0,0,0,0,1,0,0,0,330,330,330,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,257,257,257,257,257,0,0,0,0,0,0,257,257,87,0,0,0,87,257,257,0,0,0,0,0,87,0,0,0,0,0,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,17]
    tileMap.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 2)
    tileMap.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.circle)
        , [keyTile, diamondTile, bombTile, figureTile])

    let player = tileMap.extract(playerTile, ShapeType.circle)
    player.dx = 0
    player.dy = 0
    player.size = 0.99

    defaultCanvas()
    currentCanvas.background = "blue"

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
            object.flipped = false
        }

        if(rightKey.isDown) {
            object.dx = Math.min(maxAcceleration, player.dx + acceleration * apsk)
            object.flipped = true
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