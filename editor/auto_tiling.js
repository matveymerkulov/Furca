import {currentTileSet} from "./tile_set.js"
import {tileHeight, tileWidth} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {canvasUnderCursor, ctx} from "../src/canvas.js"
import {canvasMouse, element} from "../src/system.js"
import {drawDashedRegion, drawRect} from "../src/draw.js"
import {tilesPerRow} from "./tile_zoom.js"
import {Win} from "../src/gui/window.js"
import {Category, Pos, Rule} from "../src/auto_tiling.js"
import {Key} from "../src/key.js"
import {removeFromArray} from "../src/functions.js"

let currentCategory, currentRule

let selectKey = new Key("LMB")

export let rulesWindow = new Win("rules_window")
let tileSetCanvas = rulesWindow.addCanvas("tile_set_rules", 9, 16)
let rulesGridCanvas = rulesWindow.addCanvas("rules_grid", 9, 16)
let rulesListCanvas = rulesWindow.addCanvas("rules_list", 9, 16)

let addCategory = element("add_category")
let removeCategory = element("remove_category")
let renameCategory = element("rename_category")
let copyCategory = element("copy_category")

let categoriesBox = element("category")

let addRule = element("add_rule")
let removeRule = element("remove_rule")
let moveRuleLeft = element("move_rule_left")
let moveRuleRight = element("move_rule_right")



rulesListCanvas.viewport.width = rulesListCanvas.node.offsetWidth
rulesListCanvas.viewport.height = rulesListCanvas.node.offsetHeight

categoriesBox.onchange = (event) => {
    currentCategory = event.target[event.target.value].category
}

addCategory.onclick = () => {
    let name = prompt("Введите имя новой категории:")
    if(name === null) return
    currentCategory = new Category(name)
    currentTileSet.categories.push(currentCategory)
    updateCategoriesList()
}

removeCategory.onclick = () => {
    if(currentCategory === undefined) return
    if(!confirm(`Действительно удалить категорию ${currentCategory.name}?`)) return
    let categories = currentTileSet.categories
    removeFromArray(currentCategory, categories)
    currentCategory = categories.length > 0 ? categories[0] : undefined
    updateCategoriesList()
}

renameCategory.onclick = () => {
    if(currentCategory === undefined) return
    let name = prompt("Введите имя категории:", currentCategory.name)
    if(name === null) return
    currentCategory.name = name
    updateCategoriesList()
}

copyCategory.onclick = () => {
    if(currentCategory === undefined) return
    let name = prompt("Введите имя новой категории:", currentCategory.name)
    if(name === null) return
    let d = parseInt(prompt("Введите смещение:"))
    if(isNaN(d)) return
    currentCategory = currentCategory.copy(name, d)
    currentTileSet.categories.push(currentCategory)
}

addRule.onclick = () => {
    if(currentCategory === undefined) return
    currentRule = new Rule()
    currentCategory.rules.push(currentRule)
}

removeRule.onclick = () => {
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


export function updateCategoriesList() {
    while(categoriesBox.options.length > 0) {
        // noinspection JSCheckFunctionSignatures
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


tileSetCanvas.render = () => {
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

rulesGridCanvas.render = () => {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, rulesGridCanvas.viewport.width, rulesGridCanvas.viewport.height)
    let size = gridSize * 2 + 1
    let cellSize = (rulesGridCanvas.viewport.width - 1) / size
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

    if(canvasUnderCursor !== rulesGridCanvas) return

    drawDashedRegion(Math.floor(canvasMouse.x / cellSize) * cellSize + 4
        , Math.floor(canvasMouse.y / cellSize) * cellSize + 4, cellSize - 6, cellSize - 6)
}


rulesListCanvas.render = () =>  {
    if(currentCategory === undefined) return

    ctx.canvas.width = rulesListCanvas.node.offsetWidth
    ctx.canvas.height = rulesListCanvas.node.offsetHeight

    let rules = currentCategory.rules
    let size = rulesListCanvas.viewport.width / tilesPerRow
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

rulesGridCanvas.update = () => {
    if(canvasUnderCursor !== rulesGridCanvas) return
    let cellSize = (rulesGridCanvas.viewport.width - 1) / (gridSize * 2 + 1)
    let dx = Math.floor(canvasMouse.x / cellSize) - gridSize
    let dy = Math.floor(canvasMouse.y / cellSize) - gridSize
    if(selectKey.wasPressed) {
        if(currentRule === undefined) return
        let pos = findPos(dx, dy)
        let positions = currentRule.positions
        if(pos === undefined) {
            positions.push(new Pos(dx, dy))
        } else {
            removeFromArray(pos, positions)
        }
    }
}

tileSetCanvas.update = () => {
    if(canvasUnderCursor !== tileSetCanvas) return
    if(!selectKey.wasPressed || currentRule === undefined) return
    let x = Math.floor(canvasMouse.x / tileWidth)
    let y = Math.floor(canvasMouse.y / tileHeight)
    currentRule.tile = x + y * currentTileSet.columns
}

rulesListCanvas.update = () => {
    if(canvasUnderCursor !== rulesListCanvas || currentCategory === undefined
        || !selectKey.wasPressed) return

    let size = rulesListCanvas.viewport.width / tilesPerRow
    let x = Math.floor(canvasMouse.x / size)
    let y = Math.floor(canvasMouse.y / size)
    let ruleNum = x + y * tilesPerRow
    let rules = currentCategory.rules
    if(ruleNum < rules.length) {
        currentRule = rules[ruleNum]
    }
}