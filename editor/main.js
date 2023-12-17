import {project} from "../src/project.js"
import Canvas, {ctx, currentCanvas, distFromScreen, distToScreen, setCanvas} from "../src/canvas.js"
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
            floor: "small_farm_tiles.png",
            objects: "farm_objects_tiles.png",
        },
        sound: {
        }
    }
}

const modes = {
    tiles: Symbol("tiles"),
    tileMaps: Symbol("tileMaps"),
}

export let tileSet, tileMap

project.init = (texture) => {
    let select = new Key("LMB")
    let move = new Key("ControlLeft", "MMB")
    let zoomIn = new Key("WheelUp")
    let zoomOut = new Key("WheelDown")
    let switchMode = new Key("Space")

    let mode = modes.tiles

    let tileSet = {
        floor: new TileSet("floor", new ImageArray(texture.floor, 9, 7)),
        objects: new TileSet("objects", new ImageArray(texture.objects, 10, 20)),
    }

    let tileMap = {
        floor: new TileMap("floor", tileSet.floor, 16, 16, 0, 0, 1, 1),
        objects: new TileMap("objects", tileSet.objects, 16, 16, 0, 0, 1, 1),
    }

    let tileMaps = new Layer(tileMap.floor, tileMap.objects)

    let maps = Canvas.create(document.getElementById("map"), tileMaps, 30, 14)
    maps.background = "rgb(9, 44, 84)"
    let tiles = Canvas.create(document.getElementById("tiles"), new Layer(), 8, 14)
    setCanvas(maps)

    let mouseX0, mouseY0, cameraX0, cameraY0
    maps.setZoom(-19)
    tiles.setZoom(-17)

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
                canvas.setZoom(canvas.zoom - 1)
            } else if (zoomOut.wasPressed) {
                canvas.setZoom(canvas.zoom + 1)
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
    let currentTileSet
    tiles.scene.draw = function() {
        let quantity = 0
        for (const set of Object.values(tileSet)) {
            quantity += set.images.quantity
        }

        setCanvas(tiles)
        let start = 0
        let columns = Math.floor(tiles.width)
        let height = Math.ceil(quantity / columns)
        let x0 = distToScreen(0.5 * (tiles.width - columns))
        let y0 = distToScreen(0.5 * (tiles.height - height) - tiles.centerY)
        for (const set of Object.values(tileSet)) {
            let images = set.images
            let size = distToScreen(1)
            for(let i = 0; i < images.quantity; i++) {
                let pos = start + i
                let x = x0 + size * (pos % columns)
                let y = y0 + size * Math.floor(pos / columns)
                images.image(i).drawResized(x, y, size, size)
                if(set === currentTileSet && currentTile === i) {
                    drawDashedRect(Math.floor(x), Math.floor(y), Math.floor(size), Math.floor(size))
                }
                if(mouseCanvas !== tiles) continue
                if(select.isDown && boxWithPointCollision(canvasMouse, x, y, size, size)) {
                    currentTile = i
                    currentTileSet = set
                }
            }
            start += images.quantity
        }
    }

    let moveMap = new MouseMove(undefined, select)
    let mapSelection = new DashedRect()

    project.draw = () => {}

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
            if(mode === modes.tileMaps || map.tileSet === currentTileSet) {
                currentTileMap = map
            }
        })

        moveMap.object = tileMap.floor
        tileMap.objects.setPositionAs(tileMap.floor)
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