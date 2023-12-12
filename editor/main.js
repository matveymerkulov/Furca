import {project} from "../src/project.js"
import Canvas, {distFromScreen, distToScreen, setCanvas} from "../src/canvas.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import {Key, Layer, mouse} from "../src/index.js"
import {canvasMouse, screenMouse} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
import {boxWithPointCollision} from "../src/collisions.js"
import MouseMove from "./mouse_move.js"
import DashedRect from "./dashed_rect.js"
import TileSet from "../src/tile_set.js"

project.getAssets = () => {
    return {
        texture: {
            tiles: "tiles.png",
        },
        sound: {
        }
    }
}

const modes = {
    tiles: Symbol("tiles"),
    tileMaps: Symbol("tileMaps"),
}

project.init = (texture) => {
    let select = new Key("LMB")
    let move = new Key("ControlLeft", "MMB")
    let zoomIn = new Key("WheelUp")
    let zoomOut = new Key("WheelDown")
    let switchMode = new Key("Space")

    let mode = modes.tiles

    let tileSet = new TileSet(new ImageArray(texture.tiles, 16, 21))

    let tiles1 = new TileMap(tileSet, 13, 12, -7, 0, 1, 1)
    tiles1.setArray([0,0,0,42,0,0,0,0,0,98,99,16,0,0,0,0,0,0,0,0,0,0,114,115,0,0,0,0,0,0,0,0,0,0,0,98,115,0,0,0,0,0,0
        ,0,0,0,0,0,114,99,0,0,1,0,0,0,0,64,0,241,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,0,0,0,100
        ,0,0,0,114,99,98,115,0,0,0,0,0,116,0,0,0,98,115,114,99,0,0,0,0,0,0,0,0,0,98,99,114,115,57,0,0,0,0,51,0,100,101
        ,114,99,98,115,100,101,0,0,0,100,0,116,117,98,115,114,99,116,117,0,0,0,116])

    let tiles2 = new TileMap(tileSet, 13, 12, 7, 0, 1, 1)
    tiles2.setArray([0,96,97,0,0,0,0,0,0,0,96,97,0,41,112,113,0,0,0,0,0,0,0,112,113,65,257,257,257,257,0,0,0,0,0,257
        ,257,257,257,0,0,0,0,257,0,0,0,257,0,0,0,0,0,1,0,0,0,330,330,330,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ,0,0,0,0,0,0,0,0,0,0,0,0,0,257,257,257,257,257,0,0,0,0,0,0,257,257,87,0,0,0,87,257,257,0,0,0,0,0,87,0,0,0,0,0
        ,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,17])

    let tileMaps = new Layer(tiles1, tiles2)

    let maps = Canvas.create(document.getElementById("map"), tileMaps, 30, 14)
    maps.background = "rgb(9, 44, 84)"
    let tiles = Canvas.create(document.getElementById("tiles"), new Layer(), 8, 14)
    setCanvas(maps)

    let mouseX0, mouseY0, cameraX0, cameraY0
    maps.zoom = -21
    tiles.zoom = -21

    let mouseCanvas
    maps.node.addEventListener("mouseover", (e) => {
        mouseCanvas = maps
    })
    tiles.node.addEventListener("mouseover", (e) => {
        mouseCanvas = tiles
    })

    function processCamera(canvas) {
        while(true) {
            if (mouseCanvas !== canvas) break

            if (move.wasPressed) {
                mouseX0 = screenMouse.centerX
                mouseY0 = screenMouse.centerY
                cameraX0 = canvas.centerX
                cameraY0 = canvas.centerY
            } else if (move.isDown) {
                canvas.centerX = cameraX0 + distFromScreen(mouseX0 - screenMouse.centerX)
                canvas.centerY = cameraY0 + distFromScreen(mouseY0 - screenMouse.centerY)
                canvas.update()
            }

            if (zoomIn.wasPressed) {
                canvas.zoom--
            } else if (zoomOut.wasPressed) {
                canvas.zoom++
            } else {
                break
            }

            canvas.setZoomXY(canvas.zoom, screenMouse.centerX, screenMouse.centerY)
            break
        }

        setCanvas(canvas)
        canvas.draw()
    }

    let currentTile = 0
    tiles.scene.draw = function() {
        setCanvas(tiles)
        let columns = Math.floor(tiles.width)
        let images = tileSet.images
        let size = distToScreen(1)
        let height = Math.ceil(images.quantity / columns)
        let x0 = distToScreen(0.5 * (tiles.width - columns))
        let y0 = distToScreen(0.5 * (tiles.height - height) - tiles.centerY)
        for(let i = 0; i < images.quantity; i++) {
            let x = x0 + size * (i % columns)
            let y = y0 + size * Math.floor(i / columns)
            images.image(i).drawResized(x, y, size, size)
            if(currentTile === i) {
                drawDashedRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size))
            }
            if(mouseCanvas !== tiles) continue
            if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                currentTile = i
            }
        }
    }

    let moveMap = new MouseMove(undefined, select)
    let mapSelection = new DashedRect()

    project.update = () => {
        processCamera(maps)
        processCamera(tiles)

        if(switchMode.wasPressed) {
            mode = mode === modes.tiles ? modes.tileMaps : modes.tiles
        }

        if(mouseCanvas !== maps) return

        setCanvas(maps)

        let currentTileMap = undefined
        tileMaps.collisionWithPoint(mouse.centerX, mouse.centerY, (x, y, map) => {
            currentTileMap = map
        })

        moveMap.object = currentTileMap
        mapSelection.object = undefined
        if(currentTileMap === undefined) return

        switch(mode) {
            case modes.tiles:
                let tile = currentTileMap.tileForPoint(mouse)
                if(tile < 0) break
                if(select.isDown) {
                    currentTileMap.setTile(tile, currentTile)
                }
                let sprite = currentTileMap.tileSprite(tile)
                if(sprite === undefined) break
                sprite.drawDashedRect()
                break
            case modes.tileMaps:
                mapSelection.object = currentTileMap
                moveMap.execute()
                mapSelection.draw()
                break
        }
    }
}