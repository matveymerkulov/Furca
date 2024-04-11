import {currentTileSet} from "./tile_set.js"
import {blocksTileSetCanvas, maps, rulesGrid, rulesTileSetCanvas, selectKey, tileHeight, tileWidth} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {visibility} from "../src/tile_set.js"
import {drawX} from "./draw.js"
import {canvasUnderCursor, ctx, currentCanvas} from "../src/canvas.js"
import {canvasMouse, element, removeFromArray} from "../src/system.js"
import {drawDashedRegion} from "../src/draw.js"

let currentCategory, currentRule

class Category {
    name
    rules = []

    constructor(name) {
        this.name = name
    }
}

class Rule {
    tiles = []
    positions = []
}

class Position {
    dx
    dy
    tile
}

let addCategory = element("add_category")
let removeCategory = element("remove_category")

export function initRulesWindow() {
    categoriesBox.onchange = (event) => {
        currentCategory = event.target.value
    }

    addCategory.onclick = (event) => {
        let name = prompt("Введите имя новой категории:")
        if(name === undefined) return
        let categories
        if(!categoriesMap.has(currentTileSet)) {
            categories = []
            categoriesMap.set(currentTileSet, categories)
        } else {
            categories = categoriesMap.get(currentTileSet)
        }
        currentCategory = new Category(name)
        categories.push(currentCategory)
        updateCategoriesList()
    }

    removeCategory.onclick = (event) => {
        if(!confirm(`Действительно удалить категорию ${currentCategory.name}?`)) return
        let array = categoriesMap.get(currentTileSet)
        removeFromArray(currentCategory, )
        currentCategory = array.length > 0 ? array[0] : undefined
        updateCategoriesList()
    }
}

export function renderRulesTileSet() {
    renderTileSetCanvas()

    if(currentCategory === undefined) return

    for(let rule in currentCategory.rules) {
        for(let tile of rule.tiles) {
            let x = tile % currentTileSet.columns
            let y = Math.floor(tile / currentTileSet.columns)
            ctx.opacity = 0.5
            ctx.style.color = "purple"
            ctx.rect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
            ctx.opacity = 1.0
        }
    }
}

let gridSize = 2, currentGridDX = 0, currentGridDY = 0

export function renderRulesGrid() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, rulesGrid.viewport.width, rulesGrid.viewport.height)
    let size = gridSize * 2 + 1
    let cellSize = (rulesGrid.viewport.width - 1) / size
    ctx.strokeStyle = "black"
    for(let x = 0; x <= size; x++) {
        for(let y = 0; y <= size; y++) {
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
    }
    drawDashedRegion((currentGridDX + gridSize) * cellSize + 1, (currentGridDY + gridSize) * cellSize + 1
        , cellSize, cellSize)

    if(canvasUnderCursor !== currentCanvas) return

    drawDashedRegion(Math.floor(canvasMouse.x / cellSize) * cellSize + 4
        , Math.floor(canvasMouse.y / cellSize) * cellSize + 4, cellSize - 6, cellSize - 6)
}

export function renderRulesList() {

}

let categoriesMap = new Map()
let categoriesBox = element("category")

function updateCategoriesList() {
    while(categoriesBox.options.length > 0) {
        categoriesBox.remove(0)
    }
    if(!categoriesMap.has(currentTileSet)) return
    for(let category of categoriesMap.get(currentTileSet)) {
        let option = document.createElement("option")
        option.value = category
        option.innerHTML = category.name
        categoriesBox.appendChild(option)
        if(category === currentCategory) option.selected = true
    }
}

export function updateRulesWindow() {


    if(canvasUnderCursor === rulesGrid) {
        if(selectKey.wasPressed) {
            let cellSize = (rulesGrid.viewport.width - 1) / (gridSize * 2 + 1)
            currentGridDX = Math.floor(canvasMouse.x / cellSize) - gridSize
            currentGridDY = Math.floor(canvasMouse.y / cellSize) - gridSize
        }
    }
}