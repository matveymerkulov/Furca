import {currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {
    blocksTileSetCanvas,
    maps,
    rulesGrid, rulesList,
    rulesTileSetCanvas,
    selectKey,
    setTileSize,
    tileHeight, tiles,
    tileWidth
} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {visibility} from "../src/tile_set.js"
import {drawX} from "./draw.js"
import {canvasUnderCursor, ctx, currentCanvas} from "../src/canvas.js"
import {canvasMouse, element, removeFromArray} from "../src/system.js"
import {drawDashedRegion} from "../src/draw.js"
import {tilesPerRow} from "./tile_zoom.js"
import {tileSet} from "../src/project.js"
import {boxWithPointCollision} from "../src/collisions.js"
import {brushSize, setBlockSize} from "./tile_map.js"

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

let categoriesMap = new Map()
let categoriesBox = element("category")

let addRule = element("add_rule")
let removeRule = element("remove_rule")
let moveRuleLeft = element("move_rule_left")
let moveRuleRight = element("move_rule_right")

export function updateCategoriesList() {
    while(categoriesBox.options.length > 0) {
        categoriesBox.remove(0)
    }
    if(!categoriesMap.has(currentTileSet)) return
    let array = categoriesMap.get(currentTileSet)
    for(let i = 0; i < array.length; i++) {
        let category = array[i]
        let option = document.createElement("option")
        option.category = category
        option.value = i
        option.innerHTML = category.name
        categoriesBox.appendChild(option)
        if(category === currentCategory) option.selected = true
    }
}

function findRule(rule) {
    for(let i = 0; i < currentCategory.rules.length; i++) {
        if(currentCategory.rules[i] === rule) return i
    }
    return -1
}

function addNewCategory(tileSet, name) {
    let categories
    if(!categoriesMap.has(tileSet)) {
        categories = []
        categoriesMap.set(tileSet, categories)
    } else {
        categories = categoriesMap.get(tileSet)
    }
    currentCategory = new Category(name)
    categories.push(currentCategory)
    updateCategoriesList()
}

export function initRulesWindow() {
    rulesList.viewport.width = rulesList.node.offsetWidth
    rulesList.viewport.height = rulesList.node.offsetHeight

    categoriesBox.onchange = (event) => {
        currentCategory = event.target[event.target.value].category
    }

    addCategory.onclick = (event) => {
        let name = prompt("Введите имя новой категории:")
        if(name === undefined) return
        addNewCategory(currentTileSet, name)
    }

    removeCategory.onclick = (event) => {
        if(currentCategory === undefined) return
        if(!confirm(`Действительно удалить категорию ${currentCategory.name}?`)) return
        let array = categoriesMap.get(currentTileSet)
        removeFromArray(currentCategory, array)
        currentCategory = array.length > 0 ? array[0] : undefined
        updateCategoriesList()
    }

    addRule.onclick = (event) => {
        if(currentCategory === undefined) return
        currentRule = new Rule()
        currentCategory.rules.push(currentRule)
    }

    removeRule.onclick = (event) => {
        if(currentRule === undefined) return
        removeFromArray(currentRule, currentCategory.rules)
        currentRule = undefined
    }

    function moveRule(rule, di) {
        let i1 = findRule(rule)
        let i2 = i1 + di
        let rules = currentCategory.rules
        if(i2 < 0 || i2 >= rules.length) return
        let z = rules[i2]
        rules[i2] = rules[i1]
        rules[i1] = z
    }

    moveRuleLeft.onclick = (event) => {
        moveRule(currentRule, -1)
    }

    moveRuleRight.onclick = (event) => {
        moveRule(currentRule, 1)
    }

    addNewCategory(tileSet["floor"], "new")
}

export function renderRulesTileSet() {
    renderTileSetCanvas()

    if(currentCategory === undefined) return

    ctx.opacity = 0.5
    ctx.fillStyle = "purple"
    for(let rule of currentCategory.rules) {
        let tiles = rule.tiles
        for(let tileNum of tiles) {
            let x = (tileNum % currentTileSet.columns) * tileWidth
            let y = (Math.floor(tileNum / currentTileSet.columns)) * tileHeight
            ctx.rect(x, y, tileWidth, tileHeight)

            if(currentRule === rule) {
                drawDashedRegion(x, y, tileWidth, tileHeight)
            }
        }
    }
    ctx.opacity = 1.0

    if(currentRule === undefined) return

    let tiles = currentRule.tiles
    for(let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        let tileNum = tiles[tileIndex]
        let x = (tileNum % currentTileSet.columns) * tileWidth
        let y = (Math.floor(tileNum / currentTileSet.columns)) * tileHeight
        drawDashedRegion(x, y, tileWidth, tileHeight)
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
    if(currentCategory === undefined) return

    ctx.canvas.width = rulesList.node.offsetWidth
    ctx.canvas.height = rulesList.node.offsetHeight

    let rules = currentCategory.rules
    let size = rulesList.viewport.width / tilesPerRow
    for(let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        let x = (i % tilesPerRow) * size
        let y = (Math.floor(i / tilesPerRow)) * size

        let tiles = rule.tiles
        if(tiles.length !== 0) {
            currentTileSet.image(tiles[0]).drawResized(x, y, size, size)
        }

        if(rule === currentRule) {
            drawDashedRegion(x + 1, y + 1, size, size)
        }
    }
}

export function updateRulesWindow() {
    if(selectKey.wasPressed) {
        if(canvasUnderCursor === rulesGrid) {
            let cellSize = (rulesGrid.viewport.width - 1) / (gridSize * 2 + 1)
            currentGridDX = Math.floor(canvasMouse.x / cellSize) - gridSize
            currentGridDY = Math.floor(canvasMouse.y / cellSize) - gridSize
        }

        if(canvasUnderCursor === rulesTileSetCanvas) {
            if(currentRule !== undefined) {
                let tiles = currentRule.tiles
                let x = Math.floor(canvasMouse.x / tileWidth)
                let y = Math.floor(canvasMouse.y / tileHeight)
                let tileNum = x + y * currentTileSet.columns
                if(tiles.includes(tileNum)) {
                    removeFromArray(tileNum, tiles)
                } else {
                    tiles.push(tileNum)
                }
            }
        }

        if(canvasUnderCursor === rulesList) {
            let size = rulesList.viewport.width / tilesPerRow
            let x = Math.floor(canvasMouse.x / size)
            let y = Math.floor(canvasMouse.y / size)
            let ruleNum = x + y * tilesPerRow
            let rules = currentCategory.rules
            if(ruleNum < rules.length) {
                currentRule = rules[ruleNum]
            }
        }
    }
}