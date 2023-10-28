import {currentCanvas} from "../canvas.js"
import ImageArray from "../image_array.js"
import TileMap from "../tilemap.js"

function getImageData(image, x = 0, y = 0, width, height) {
    if(width === undefined) width = image.width
    if(height === undefined) height = image.height
    const canvas = document.createElement('canvas')
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
    return {canvas: canvas, data: canvas.getContext('2d').getImageData(x, y, width, height).data}
}

function getPixel(data, x, y, width) {
    let offset = 4 * (x + y * width)
    let value = data[offset] + (data[offset + 1] << 8) + (data[offset + 2] << 16) + (data[offset + 3] << 24)
    return value
}

function downloadCanvas(canvas) {
    const downloadImage = document.createElement("a");
    document.body.appendChild(downloadImage);
    downloadImage.setAttribute("download", "image");
    downloadImage.href = canvas.toDataURL();
    downloadImage.click();
    downloadImage.remove();
}

export function tilemapFromImage(image, cellWidth, cellHeight, columns, tx, ty, twidth, theight) {
    let width = image.width
    let height = image.height
    let tiles = []

    let imageData = getImageData(image).data
    let screenColumns = width / cellWidth
    let screenRows = height / cellHeight
    let tilesetArray = new Array(screenColumns * screenRows)

    for(let y = 0; y < screenRows; y ++) {
        let yy = y * cellWidth
        for(let x = 0; x < screenColumns; x ++) {
            let found = false
            let xx = x * cellWidth
            main: for(let i = 0; i < tiles.length; i++) {
                let tileData = tiles[i]
                for(let dy = 0; dy < cellHeight; dy++) {
                    for(let dx = 0; dx < cellWidth; dx++) {
                        if(getPixel(imageData, xx + dx, yy + dy, width) !== getPixel(tileData, dx, dy, cellWidth)) {
                            continue main
                        }
                    }
                }
                found = true
                tilesetArray[x + y * screenColumns] = i
                break
            }
            if(!found) {
                tilesetArray[x + y * screenColumns] = tiles.length
                tiles.push(getImageData(image, xx, yy, cellWidth, cellHeight).data)

            }
        }
    }

    let rows = Math.floor((tiles.length + columns - 1) / columns)
    let tilesetWidth = cellWidth * columns
    let tilesetHeight = cellHeight * rows
    let canvas = document.createElement("canvas")
    canvas.width = tilesetWidth
    canvas.height = tilesetHeight
    let ctx = canvas.getContext("2d")

    for(let i = 0; i < tiles.length; i++) {
        ctx.putImageData(new ImageData(tiles[i], cellWidth, cellHeight)
            , (i % columns) * cellWidth, Math.floor(i / columns) * cellHeight);
    }

    let tilesetImage = new Image()
    tilesetImage.src = canvas.toDataURL()

    let tilemap = new TileMap(new ImageArray(tilesetImage, columns, rows), screenColumns, screenRows
        , tx, ty, twidth, theight)
    tilemap.map.array = tilesetArray
    return tilemap
}