import {Win} from "../src/gui/window.js"
import {currentImageArray, renderTileSetCanvas} from "./tile_set_properties.js"
import {element, texture} from "../src/system.js"
import {imageArray} from "../src/project.js"
import {currentTileSet} from "./tile_set.js"
import {ctx} from "../src/canvas.js"
import {drawLine} from "../lib/draw.js"
import {tileHeight, tileWidth} from "./main.js"

export const imageArrayPropertiesWindow = new Win("image_array_window")

export const imageArrayCanvas = imageArrayPropertiesWindow.addCanvas("image_array", 9, 16)

export function updateTexturesList() {
    imageComboBox.innerText = ""
    for(const [name, tex] of Object.entries(texture)) {
        const option = document.createElement("option")
        option.value = name
        option.innerText = name
        option["texture"] = tex
        if(currentImageArray.texture === texture) option.selected = true
        imageComboBox.append(option)
    }
}

imageArrayCanvas.render = () => {
    renderTileSetCanvas(100, 100, false)
    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height
    const tWidth = canvasWidth / newColumns
    const tHeight = canvasHeight / newRows

    for(let i = 0; i <= newColumns; i++) {
        const x = i * tWidth
        drawLine(x, 0, x, canvasHeight)
    }
    for(let i = 0; i <= newRows; i++) {
        const y = i * tHeight
        drawLine(0, y, canvasWidth, y)
    }
}

let newColumns, newRows

const columnsField = element("image_array_columns") as HTMLInputElement
const rowsField = element("image_array_rows") as HTMLInputElement

const imageComboBox = element("images")

imageArrayPropertiesWindow.init = () => {
    updateTexturesList()
    columnsField.value = newColumns = currentImageArray.columns
    rowsField.value = newRows = currentImageArray.rows
}

imageComboBox.onchange = (event) => {
    currentImageArray.texture = event.target[(event.target as HTMLSelectElement)].selectedIndex["texture"]
}

columnsField.addEventListener("change", (event) => {
    newColumns = parseInt(columnsField.value)
})

rowsField.addEventListener("change", (event) => {
    newRows = parseInt(rowsField.value)
})

imageArrayPropertiesWindow.onClose = () => {
    if(newColumns !== currentImageArray.rows || newRows !== currentImageArray.rows) {
        currentImageArray.init(newColumns, newRows)
    }
}