import {currentTileSet} from "./tile_set.js"
import {rulesGrid, rulesList, rulesTileSetCanvas, selectKey, tileHeight, tileWidth} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {canvasUnderCursor, ctx, currentCanvas} from "../src/canvas.js"
import {canvasMouse, element, removeFromArray} from "../src/system.js"
import {drawDashedRegion, drawRect} from "../src/draw.js"
import {tilesPerRow} from "./tile_zoom.js"
import {arrayToString} from "./save_load.js"

let currentCategory, currentRule

export class Category {
    name
    rules
    prolong

    constructor(name, rules = [], prolong = false) {
        this.name = name
        this.rules = rules
        this.prolong = prolong
    }

    toString() {
        return `new Category("${this.name}", ${arrayToString(this.rules, 1)}, ${this.prolong})`
    }
}

export class Rule {
    tile
    positions

    constructor(tile, positions = []) {
        this.tile = tile
        this.positions = positions
    }

    toString() {
        return `new Rule(${this.tile}, ${arrayToString(this.positions)})`
    }
}

export class Pos {
    dx
    dy

    constructor(dx, dy) {
        this.dx = dx
        this.dy = dy
    }

    toString() {
        return `new Pos(${this.dx}, ${this.dy})`
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

    currentCategory = undefined
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

    function findRule(rule) {
        for(let i = 0; i < currentCategory.rules.length; i++) {
            if(currentCategory.rules[i] === rule) return i
        }
        return -1
    }

    function moveRule(rule, di) {
        let i1 = findRule(rule)
        let i2 = i1 + di
        let rules = currentCategory.rules
        if(i1 < 0 || i2 < 0 || i2 >= rules.length) return
        let z = rules[i1]
        rules[i1] = rules[i2]
        rules[i2] = z
    }

    moveRuleLeft.onclick = () => {
        if(currentRule !== undefined) moveRule(currentRule, -1)
    }

    moveRuleRight.onclick = () => {
        if(currentRule !== undefined) moveRule(currentRule, 1)
    }
}

export function renderRulesTileSet() {
    renderTileSetCanvas()

    if(currentCategory === undefined) return

    ctx.globalAlpha = 0.5
    ctx.fillStyle = "mediumorchid"
    for(let rule of currentCategory.rules) {
        let tileNum = rule.tile
        let x = (tileNum % currentTileSet.columns) * tileWidth
        let y = (Math.floor(tileNum / currentTileSet.columns)) * tileHeight
        ctx.fillRect(x, y, tileWidth, tileHeight)

        if(currentRule === rule) {
            drawDashedRegion(x, y, tileWidth, tileHeight)
        }
    }
    ctx.globalAlpha = 1.0

    if(currentRule === undefined) return

    let tileNum = currentRule.tile
    let x = (tileNum % currentTileSet.columns) * tileWidth
    let y = (Math.floor(tileNum / currentTileSet.columns)) * tileHeight
    drawDashedRegion(x, y, tileWidth, tileHeight)
}

let gridSize = 2

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

    if(currentRule !== undefined) {
        for(let pos of currentRule.positions) {
            drawRect("white", "black", (pos.dx + gridSize) * cellSize + 7
                , (pos.dy + gridSize) * cellSize + 7, cellSize - 12, cellSize - 12)
        }

        currentTileSet.image(currentRule.tile).drawResized(gridSize * cellSize + 1
            , gridSize * cellSize + 1, cellSize - 1, cellSize - 1)
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

        currentTileSet.image(rule.tile).drawResized(x, y, size, size)

        if(rule === currentRule) {
            drawDashedRegion(x + 1, y + 1, size - 1, size - 1)
        }
    }
}

function findPos(dx, dy, add = true) {
    for(let pos of currentRule.positions) {
        if(pos.dx === dx && pos.dy === dy) return pos
    }
    return undefined
}

export function updateRulesWindow() {
    if(canvasUnderCursor === rulesGrid) {
        let cellSize = (rulesGrid.viewport.width - 1) / (gridSize * 2 + 1)
        let dx = Math.floor(canvasMouse.x / cellSize) - gridSize
        let dy = Math.floor(canvasMouse.y / cellSize) - gridSize
        if(selectKey.wasPressed) {
            let pos = findPos(dx, dy)
            if(currentRule === undefined) return
            let positions = currentRule.positions
            if(pos === undefined) {
                positions.push(new Pos(dx, dy))
            } else {
                removeFromArray(pos, positions)
            }
        }
    }

    if(selectKey.wasPressed) {
        if(canvasUnderCursor === rulesTileSetCanvas) {
            if(currentRule !== undefined) {
                let x = Math.floor(canvasMouse.x / tileWidth)
                let y = Math.floor(canvasMouse.y / tileHeight)
                currentRule.tile = x + y * currentTileSet.columns
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
                }
            }
        }
    }
}

function findTileCategory(map, column, row, prolong = false) {
    if(prolong) {
        if(column < 0) column = 0
        if(column >= map.columns) column = map.columns - 1
        if(row < 0) row = 0
        if(row >= map.rows) row = map.rows - 1
    } else {
        if(column < 0 || column >= map.columns || row < 0 ||row >= map.rows) return undefined
    }

    let tileNum = map.tile(column, row)
    for(let category of map.tileSet.categories) {
        for(let rule of category.rules) {
            if(rule.tile === tileNum) return category
        }
    }
    return undefined
}

export function enframeTile(map, column, row) {
    let tileCategory = findTileCategory(map, column, row, false)
    if(tileCategory === undefined) return
    let prolong = tileCategory.prolong
    rule: for(let rule of tileCategory.rules) {
        for(let pos of rule.positions) {
            let category = findTileCategory(map, pos.dx + column, pos.dy + row, prolong)
            if(category === tileCategory) continue rule
        }
        map.setTile(column, row, rule.tile)
        return
    }
}