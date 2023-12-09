import {project} from "../src/project.js"
import Canvas, {distFromScreen, distToScreen, setCanvas, yToScreen} from "../src/canvas.js"
import TileMap from "../src/tilemap.js"
import ImageArray from "../src/image_array.js"
import {Key, Layer, mouse} from "../src/index.js"
import {canvasMouse, screenMouse} from "../src/system.js"
import {drawDashedRect} from "../src/draw_rect.js"
import {boxWithPointCollision} from "../src/collisions.js"
import MouseMove from "./mouse_move.js"
import DashedRect from "./dashed_rect.js"

project.getAssets = () => {
    return {
        texture: {
            tiles: "tiles.png",
        },
        sound: {
        }
    }
}

project.key = {
    select: new Key("LMB"),
    move: new Key("ControlLeft", "MMB"),
    zoomIn: new Key("WheelUp"),
    zoomOut: new Key("WheelDown"),
    switchMode: new Key("Space"),
}

const modes = {
    tiles: Symbol("tiles"),
    tileMaps: Symbol("tileMaps"),
}

project.init = (texture) => {
    let mode = modes.tiles

    let tileMap = new TileMap(new ImageArray(texture.tiles, 16, 21), 13, 12, -7, 0, 1, 1)
    tileMap.array = [0,0,0,42,0,0,0,0,0,98,99,16,0,0,0,0,0,0,0,0,0,0,114,115,0,0,0,0,0,0,0,0,0,0,0,98,115,0,0,0,0,0,0
        ,0,0,0,0,0,114,99,0,0,1,0,0,0,0,64,0,241,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,0,0,0,0,0,0,0,0,114,99,0,0,0,0,0,100
        ,0,0,0,114,99,98,115,0,0,0,0,0,116,0,0,0,98,115,114,99,0,0,0,0,0,0,0,0,0,98,99,114,115,57,0,0,0,0,51,0,100,101
        ,114,99,98,115,100,101,0,0,0,100,0,116,117,98,115,114,99,116,117,0,0,0,116]

    let tileMap2 = new TileMap(new ImageArray(texture.tiles, 16, 21), 13, 12, 7, 0, 1, 1)
    tileMap2.array = [0,96,97,0,0,0,0,0,0,0,96,97,0,41,112,113,0,0,0,0,0,0,0,112,113,65,257,257,257,257,0,0,0,0,0,257
        ,257,257,257,0,0,0,0,257,0,0,0,257,0,0,0,0,0,1,0,0,0,330,330,330,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ,0,0,0,0,0,0,0,0,0,0,0,0,0,257,257,257,257,257,0,0,0,0,0,0,257,257,87,0,0,0,87,257,257,0,0,0,0,0,87,0,0,0,0,0
        ,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,17]

    let tileMaps = new Layer(tileMap, tileMap2)

    let maps = Canvas.create(document.getElementById("map"), tileMaps, 30, 14)
    maps.background = "rgb(9, 44, 84)"
    let tiles = Canvas.create(document.getElementById("tiles"), new Layer(), 8, 14)
    setCanvas(maps)

    let move = project.key.move
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

            if (project.key.zoomIn.wasPressed) {
                canvas.zoom--
            } else if (project.key.zoomOut.wasPressed) {
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
        let images = tileMap.tiles._images
        let size = distToScreen(1)
        let height = Math.ceil(images.length / columns)
        let x0 = distToScreen(0.5 * (tiles.width - columns))
        let y0 = distToScreen(0.5 * (tiles.height - height) - tiles.centerY)
        for(let i = 0; i < images.length; i++) {
            let x = x0 + size * (i % columns)
            let y = y0 + size * Math.floor(i / columns)
            images[i].drawResized(x, y, size, size)
            if(currentTile === i) {
                drawDashedRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size))
            }
            if(mouseCanvas !== tiles) continue
            if(project.key.select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                currentTile = i
            }
        }
    }

    let moveMap = new MouseMove(undefined, project.key.select)
    let mapSelection = new DashedRect()

    project.update = () => {
        processCamera(maps)
        processCamera(tiles)

        if(project.key.switchMode.wasPressed) {
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
                if(project.key.select.isDown) {
                    currentTileMap.array[tile] = currentTile
                }
                let sprite = currentTileMap.getTileSprite(currentTileMap.getTileColumn(tile)
                    , currentTileMap.getTileRow(tile))
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