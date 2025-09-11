import {canvasUnderCursor, ctx, currentCanvas} from "../src/canvas.js"
import SelectTileSetRegion, {tileSetRegion} from "./select_tile_set_region.js"
import {canvasMouse, element} from "../src/system.js"
import {drawDashedRegion, drawLine, drawRect, drawShape} from "./draw.js"
import {currentTileSet} from "./tile_set.js"
import {Visibility} from "../src/tile_set.js"
import {setTileSize, tileHeight, tileWidth,} from "./main.js"
import {Win} from "../src/gui/window.js"
import {delPropertiesKey, newBlockKey, newFrameKey, selectTilePropertiesKey, toggleVisibilityKey} from "./keys.js"
import {imageArray} from "../src/project.js"
import {enterString} from "./input.js"
import {ImageArray} from "../src/image_array.js"
import {settings} from "./settings.js"
import {imageArrayPropertiesWindow} from "./image_array_properties.js"
import {BlockType} from "../src/block.js"

export const tileSetPropertiesWindow = new Win("tile_set_window")

export const blocksCanvas = tileSetPropertiesWindow.addCanvas("tile_set_blocks", 9, 16)
blocksCanvas.add(new SelectTileSetRegion(), selectTilePropertiesKey)

const imageArrayComboBox = element("image_arrays")

export let currentImageArray

export function updateImageArraysList() {
    imageArrayComboBox.innerText = ""
    for(const [name, array] of Object.entries(imageArray)) {
        const option = document.createElement("option") as HTMLOptionElement
        imageArrayComboBox.append(option)
        option.value = name
        option.innerText = name
        option["array"] = array
        if(currentTileSet.images === array) option.selected = true
    }
}

export function renderTileSetCanvas(dWidth, dHeight, selection = true) {
    let images = currentTileSet.images
    let tex = images.texture
    let scale = Math.min((document.body.offsetWidth - dWidth) / tex.width
        , (document.body.offsetHeight - dHeight) / tex.height, 2)
    let style = currentCanvas.node.style
    let canvasWidth = tex.width * scale
    let canvasHeight = tex.height * scale
    style.width = canvasWidth + "px"
    style.height = canvasHeight + "px"

    ctx.canvas.width = canvasWidth
    ctx.canvas.height = canvasHeight
    ctx.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, canvasWidth, canvasHeight)

    setTileSize(canvasWidth / images.columns, canvasHeight / images.rows)

    if(canvasUnderCursor !== currentCanvas || !selection) return

    drawDashedRegion(Math.floor(canvasMouse.x / tileWidth) * tileWidth + 3
        , Math.floor(canvasMouse.y / tileHeight) * tileHeight + 3, tileWidth - 7, tileHeight - 7)
}


blocksCanvas.render = () => {
    renderTileSetCanvas(100, 100)

    for(let y = 0; y < currentTileSet.rows; y++) {
        for(let x = 0; x < currentTileSet.columns; x++) {
            let n = x + y * currentTileSet.columns
            if(currentTileSet.visibility[n] !== Visibility.hidden) continue
            drawShape((x + 0.5) * tileWidth, (y + 0.5) * tileHeight, settings.tileSet.visibility)
        }
    }

    for(let block of currentTileSet.blocks) {
        let innerColor, outerColor
        if(block.type === BlockType.block) {
            innerColor = "lightgreen"
            outerColor = "green"
        } else if(block.type === BlockType.frame) {
            innerColor = "red"
            outerColor = "darkred"
        }
        drawRect(block.x * tileWidth, block.y * tileHeight
            , block.width * tileWidth, block.height * tileHeight
            , block.type === BlockType.block ? settings.tileSet.block : settings.tileSet.frame)
    }

    if(tileSetRegion === undefined) return
    drawDashedRegion(tileSetRegion.x * tileWidth, tileSetRegion.y * tileHeight
        , (tileSetRegion.width + 1) * tileWidth, (tileSetRegion.height + 1) * tileHeight)
}


blocksCanvas.update = () => {
    const x = Math.floor(canvasMouse.x / tileWidth)
    const y = Math.floor(canvasMouse.y / tileHeight)

    if(delPropertiesKey.wasPressed) {
        currentTileSet.removeBlock(x, y)
    }

    if(toggleVisibilityKey.wasPressed) {
        if(tileSetRegion === undefined) {
            let tileNum = x + y * currentTileSet.columns
            const vis = currentTileSet.visibility[tileNum]
            if(vis === Visibility.block) return
            currentTileSet.visibility[tileNum] = vis === Visibility.visible ? Visibility.hidden : Visibility.visible
        } else {
            let hide
            tileSetRegion.process((tileNum) => {
                let vis = currentTileSet.visibility[tileNum]
                if(vis === Visibility.block) return
                if(hide === undefined) hide = vis === Visibility.visible ? Visibility.hidden : Visibility.visible
                currentTileSet.visibility[tileNum] = hide
            })
        }
    }

    if(tileSetRegion === undefined) return

    if(newBlockKey.wasPressed) {
        currentTileSet.addRegion(tileSetRegion, BlockType.block)
    } else if(newFrameKey.wasPressed) {
        currentTileSet.addRegion(tileSetRegion, BlockType.frame)
    }
}

const newImageArray = element("new_image_array")
const editImageArray = element("edit_image_array")
const deleteImageArray = element("delete_image_array")

imageArrayComboBox.onchange = (event) => {
    const target = event.target as HTMLSelectElement
    currentTileSet.images = target[target.selectedIndex]["array"]
}

newImageArray.onclick = () => {
    enterString("Введите название нового массива изображений:", "", (string) => {
        //const array = new ImageArray()
    })
}

editImageArray.onclick = () => {
    currentImageArray = currentTileSet.images
    imageArrayPropertiesWindow.open()
}