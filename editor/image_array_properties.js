import {Win} from "../src/gui/window.js"
import {currentImageArray, renderTileSetCanvas} from "./tile_set_properties.js"
import {element, texture} from "../src/system.js"
import {imageArray} from "../src/project.js"
import {currentTileSet} from "./tile_set.js"

export const imageArrayPropertiesWindow = new Win("image_array_window")

export const imageArrayCanvas = imageArrayPropertiesWindow.addCanvas("image_array", 9, 16)

const columnsField = element("image_array_columns")
const rowsField = element("image_array_rows")

const imageComboBox = element("images")

export function updateTexturesList() {
    imageComboBox.innerText = ""
    for(const [name, tex] of Object.entries(texture)) {
        const option = document.createElement("option")
        option.value = name
        option.innerText = name
        option.texture = tex
        if(currentImageArray.texture === texture) option.selected = true
        imageComboBox.append(option)
    }
}

imageArrayCanvas.render = () => {
    renderTileSetCanvas(100, 100, false)
}

imageArrayPropertiesWindow.init = () => {
    updateTexturesList()
    columnsField.value = currentImageArray.columns
    rowsField.value = currentImageArray.rows
}

imageComboBox.onchange = (event) => {
    currentImageArray.texture = event.target[event.target.selectedIndex].texture
}