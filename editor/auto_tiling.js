import {currentBlock, currentTile, currentTileSet} from "./tile_set.js"
import {
    blocksTileSetCanvas, delKey,
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
import {arrayToString} from "./save_load.js"

let currentCategory, currentRule

export class Category {
    name
    rules = []

    constructor(name, rules = []) {
        this.name = name
        this.rules = rules
    }

    toString() {
        return `new Category("${this.name}", ${arrayToString(this.rules, 1)})`
    }
}

export class Rule {
    tiles
    positions

    constructor(tiles = [], positions = []) {
        this.tiles = tiles
        this.positions = positions
    }

    toString() {
        return `new Rule(${arrayToString(this.tiles)}, ${arrayToString(this.positions)})`
    }
}

export class Position {
    dx
    dy
    tileNum

    constructor(dx, dy, tileNum) {
        this.dx = dx
        this.dy = dy
        this.tileNum = tileNum
    }

    toString() {
        return `new Position(${this.dx}, ${this.dy}, ${this.tileNum})`
    }
}

let addCategory = element("add_category")
let removeCategory = element("remove_category")

let categoriesBox = element("category")

let addRule = element("add_rule")
let removeRule = element("remove_rule")
let moveRuleLeft = element("move_rule_left")
let moveRuleRight = element("move_rule_right")

export function updateCategoriesList() {
    while(categoriesBox.options.length > 0) {
        categoriesBox.remove(0)
    }
    let categories = currentTileSet.categories
    for(let i = 0; i < categories.length; i++) {
        let category = categories[i]
        let option = document.createElement("option")
        option.category = category
        option.value = i.toString()
        option.innerHTML = category.name
        categoriesBox.appendChild(option)
        if(i === 0 && currentCategory === undefined) currentCategory = categories[0]
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
    currentCategory = new Category(name)
    tileSet.categories.push(currentCategory)
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
        if(name === null) return
        addNewCategory(currentTileSet, name)
    }

    removeCategory.onclick = (event) => {
        if(currentCategory === undefined) return
        if(!confirm(`Действительно удалить категорию ${currentCategory.name}?`)) return
        let categories = currentTileSet.categories
        removeFromArray(currentCategory, categories)
        currentCategory = categories.length > 0 ? categories[0] : undefined
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
}

export function renderRulesTileSet() {
    renderTileSetCanvas()

    if(currentCategory === undefined) return

    ctx.globalAlpha = 0.5
    ctx.fillStyle = "mediumorchid"
    for(let rule of currentCategory.rules) {
        let tiles = rule.tiles
        for(let tileNum of tiles) {
            let x = (tileNum % currentTileSet.columns) * tileWidth
            let y = (Math.floor(tileNum / currentTileSet.columns)) * tileHeight
            ctx.fillRect(x, y, tileWidth, tileHeight)

            if(currentRule === rule) {
                drawDashedRegion(x, y, tileWidth, tileHeight)
            }
        }
    }
    ctx.globalAlpha = 1.0

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

    if(currentRule !== undefined) {
        for(let pos of currentRule.positions) {
            currentTileSet.image(pos.tileNum).drawResized((pos.dx + gridSize) * cellSize + 1
                , (pos.dy + gridSize) * cellSize + 1, cellSize - 1, cellSize - 1)
        }

        if(currentRule.tiles.length > 0) {
            currentTileSet.image(currentRule.tiles[0]).drawResized(gridSize * cellSize + 1
                , gridSize * cellSize + 1, cellSize - 1, cellSize - 1)
        }
    }

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

function findPos(dx, dy, add = true) {
    for(let pos of currentRule.positions) {
        if(pos.dx === dx && pos.dy === dy) return pos
    }
    if(!add) return undefined
    let pos = new Position(currentGridDX, currentGridDY, undefined)
    currentRule.positions.push(pos)
    return pos
}

export function updateRulesWindow() {
    if(canvasUnderCursor === rulesGrid) {
        let cellSize = (rulesGrid.viewport.width - 1) / (gridSize * 2 + 1)
        let dx = Math.floor(canvasMouse.x / cellSize) - gridSize
        let dy = Math.floor(canvasMouse.y / cellSize) - gridSize
        if(selectKey.wasPressed) {
            currentGridDX = dx
            currentGridDY = dy
        }
        if(delKey.wasPressed) {
            let pos = findPos(dx, dy, false)
            if(pos !== undefined) {
                removeFromArray(pos, currentRule.positions)
            }
        }
    }

    if(selectKey.wasPressed) {
        if(canvasUnderCursor === rulesTileSetCanvas) {
            if(currentRule !== undefined) {
                let tiles = currentRule.tiles
                let x = Math.floor(canvasMouse.x / tileWidth)
                let y = Math.floor(canvasMouse.y / tileHeight)
                let tileNum = x + y * currentTileSet.columns
                if(currentGridDX === 0 && currentGridDY === 0) {
                    if(tiles.includes(tileNum)) {
                        removeFromArray(tileNum, tiles)
                    } else {
                        tiles.push(tileNum)
                    }
                } else {
                    let pos = findPos(currentGridDX, currentGridDY)
                    pos.tileNum = tileNum
                }
            }
        }

        if(canvasUnderCursor === rulesList) {
            if(currentCategory !== undefined) {
                let size = rulesList.viewport.width / tilesPerRow
                let x = Math.floor(canvasMouse.x / size)
                let y = Math.floor(canvasMouse.y / size)
                let ruleNum = x + y * tilesPerRow
                let rules = currentCategory.rules
                if(ruleNum < rules.length) {
                    currentRule = rules[ruleNum]
                    currentGridDX = 0
                    currentGridDY = 0
                }
            }
        }
    }
}