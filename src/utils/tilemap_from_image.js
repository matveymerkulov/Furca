import {TextureArray} from "../texture_array.js"
import {TileMap} from "../tile_map.js"

function getImageData(image, x = 0, y = 0, width, height) {
    if(width === undefined) width = image.shapeWidth
    if(height === undefined) height = image.shapeHeight
    const canvas = document.createElement('canvas')
    canvas.width = image.shapeWidth;
    canvas.height = image.shapeHeight;
    canvas.getContext('2d').drawImage(image, 0, 0, image.shapeWidth, image.shapeHeight);
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

export function tileMapFromImage(image, tilesImage, cellWidth, cellHeight, columns, tx, ty, twidth, theight) {
    let tiles = []

    let tileSetColumns = tilesImage.shapeWidth / cellWidth
    let tileSetRows = tilesImage.shapeHeight / cellHeight
    for(let y = 0; y < tileSetRows; y ++) {
        let yy = y * cellWidth
        for(let x = 0; x < tileSetColumns; x ++) {
            let xx = x * cellWidth
            tiles.push(getImageData(tilesImage, xx, yy, cellWidth, cellHeight).data)
        }
    }

    let width = image.shapeWidth
    let height = image.shapeHeight

    let imageData = getImageData(image).data
    let screenColumns = 13//width / cellWidth
    let screenRows = 12//height / cellHeight
    let tilemapArray = new Array(screenColumns * screenRows)

    for(let y = 0; y < screenRows; y ++) {
        let yy = y * cellHeight
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
                tilemapArray[x + y * screenColumns] = i
                break
            }
            if(!found) {
                tilemapArray[x + y * screenColumns] = tiles.length
                tiles.push(getImageData(image, xx, yy, cellWidth, cellHeight).data)
            }
        }
    }

    console.log(`[${tilemapArray.toString()}]`)

    let rows = Math.floor((tiles.length + columns - 1) / columns)

    let canvas = document.createElement("canvas")
    canvas.width = columns * cellWidth
    canvas.height = rows * cellHeight
    let ctx = canvas.getContext("2d")

    let imageArray = new TextureArray(image, columns, rows)

    for(let i = 0; i < tiles.length; i++) {
        ctx.putImageData(new ImageData(tiles[i], cellWidth, cellHeight), cellWidth * (i % columns), cellHeight
            * Math.floor(i / columns))
        //imageArray._images[i] = Img.fromCanvas(canvas)
    }

    //downloadCanvas(canvas)

    let tileMap = new TileMap(imageArray, screenColumns, screenRows, tx, ty, twidth, theight)
    tileMap.array = tilemapArray
    return tileMap
}