import {project} from "../../src/project.js"
import {initTileMap, TileMap} from "../../src/tile_map.js"
import {ImageArray} from "../../src/image_array.js"
import {apsk, defaultCanvas, texture} from "../../src/system.js"
import {Key} from "../../src/key.js"
import {Sprite} from "../../src/sprite.js"
import {Layer} from "../../src/layer.js"
import {TileSet} from "../../src/tile_set.js"
import {currentCanvas} from "../../src/canvas.js"

import {ShapeType} from "../../src/shape_type.js"

project.getAssets = () => {
    return {
        texture: ["tiles.png", "screens/02.png"],
        sound: []
    }
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

project.init = () => {
    initTileMap()

    let left = new Key("KeyA")
    let right = new Key("KeyD")
    let jump = new Key("KeyW")

    //let tileMap = tileMapFromImage(texture.levels, texture.tiles, 16, 16, 16, 0, 0, 1, 1)
    let tileSet = new TileSet(new ImageArray(texture.tiles, 16, 21))
    tileSet.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.box), 2)
    tileSet.setCollision(new Sprite(undefined, 0.5, 0.5, 1.0, 1.0, ShapeType.circle)
        , [keyTile, diamondTile, bombTile, figureTile])

    let tiles = new TileMap(tileSet, 13, 12, 0, 0, 1, 1)
    tiles.setArray([0,0,0,42,0,0,0,0,0,98,99,16,0,0,0,0,0,0,0,0,0,0,114,115,0,0,0,0,0,0,0,0,0,0,0,98,115,0,0,0,0,0,0,0,0
        ,0,0,0,114,99,0,0,1,0,0,0,0,64,0,241,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,0,0,0,100,0,0,0
        ,114,99,98,115,0,0,0,0,0,116,0,0,0,98,115,114,99,0,0,0,0,0,0,0,0,0,98,99,114,115,57,0,0,0,0,51,0,100,101,114,99
        ,98,115,100,101,0,0,0,100,0,116,117,98,115,114,99,116,117,0,0,0,116])
    //tileMap.array = [0,96,97,0,0,0,0,0,0,0,96,97,0,41,112,113,0,0,0,0,0,0,0,112,113,65,257,257,257,257,0,0,0,0,0,257,257,257,257,0,0,0,0,257,0,0,0,257,0,0,0,0,0,1,0,0,0,330,330,330,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,257,257,257,257,257,0,0,0,0,0,0,257,257,87,0,0,0,87,257,257,0,0,0,0,0,87,0,0,0,0,0,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,17]

    let player = tiles.extractVectorTile(playerTile, ShapeType.circle)
    player.dx = 0
    player.dy = 0
    player.size = 0.99

    defaultCanvas(16, 16)
    currentCanvas.background = "blue"

    function onGround() {
        if(player.dy < 0) {
            player.dy = 0
            return
        }
        player.dy = 0
        if(jump.isDown) {
            player.dy = jumpdy
        }
    }

    function tileCollision(shape, tileNum, x, y) {
        switch(tileNum) {
            case keyTile:
            case bombTile:
            case figureTile:
            case diamondTile:
                tiles.setTileByPos(x, y, emptyTile)
                break
            default:
                player.pushFromSprite(shape)
                break
        }
    }

    let panels = new Layer()

    tiles.processTilesByPos((column, row, tileNum) => {
        if(tileNum === panelTile) {
            let panel = tiles.extractVectorTileByPos(column, row, ShapeType.box)
            panel.dy = -panelSpeed
            panels.add(panel)
        }
    })

    project.scene.add(tiles, player, panels)

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
        player.y += player.dy * apsk

        if(!tiles.overlaps(player)) {
            onGround()
            player.limit(tiles)
        }

        tiles.collisionWithSprite(player, (shape, tileNum, x, y) => {
            tileCollision(shape, tileNum, x, y)
            onGround()
        })

        for(let panel of panels.items) {
            panel.y += panel.dy * apsk
            if(!tiles.overlaps(panel)) {
                panel.dy = -panel.dy
                panel.limit(tiles)
            }

            if(panel.collidesWithSprite(player)) {
                player.pushFromSprite(panel)
            }

            tiles.collisionWithSprite(panel, (shape, tileNum, x, y) => {
                panel.pushFromSprite(shape)
                panel.dy = -panel.dy
            })
        }

        horizontalMovement(player, left, right, horizontalAcceleration, maxHorizontalAcceleration)

        player.x += player.dx * apsk

        if(!tiles.overlaps(player)) {
            player.dx = 0
            player.limit(tiles)
        }

        tiles.collisionWithSprite(player, (shape, tileNum, x, y) => {
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