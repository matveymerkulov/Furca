import {currentCanvas} from "../canvas.js"
import {ctx} from "../system.js"

function getImageCanvas(image, x = 0, y = 0, width, height) {
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

export function tilemapFromImage(fileName, cellWidth, cellHeight, columns) {
    let image = new Image()
    image.onload = function() {
        let width = image.width
        let height = image.height
        let tiles = []

        let imageData = getImageCanvas(image).data

        for(let y = 0; y < height; y += cellHeight) {
            for(let x = 0; x < width; x += cellWidth) {
                let found = false
                main: for(let tileData of tiles) {
                    for(let dy = 0; dy < cellHeight; dy++) {
                        for(let dx = 0; dx < cellWidth; dx++) {
                            if(getPixel(imageData, x + dx, y + dy, width) !== getPixel(tileData, dx, dy, cellWidth)) {
                                continue main
                            }
                        }
                    }
                    found = true
                    break
                }
                if(!found) {
                    tiles.push(getImageCanvas(image, x, y, cellWidth, cellHeight).data)
                }
            }
        }

        let rows = Math.ceil(tiles.length / columns)
        let tilesetWidth = cellWidth * columns
        let tilesetHeight = cellHeight * rows
        //let image = new Image(tilesetWidth, tilesetHeight)
        let canvas = document.createElement("canvas")
        canvas.width = tilesetWidth
        canvas.height = tilesetHeight
        //let ctx2 = canvas.getContext("2d")

        //ctx.putImageData(new ImageData(imageData, width, height), 0, 0);
        ctx.fillStyle = "rgba(255,255,255,255)"
        ctx.fillRect(0, 0, 2000, 2000)
        for(let i = 0; i < tiles.length; i++) {
            ctx.putImageData(new ImageData(tiles[i], cellWidth, cellHeight)
                , (i % columns) * cellWidth, Math.floor(i / columns) * cellHeight);
        }
        //if(tiles.length > 1) downloadCanvas(canvas)
        //ctx.putImageData(new ImageData)
        throw new Error("Done!");
    }
    image.src = fileName
}