import {currentTileSet} from "./tile_set.js"
import {tileHeight, tileWidth} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {canvasUnderCursor, ctx} from "../src/canvas.js"
import {canvasMouse, element} from "../src/system.js"
import {Win} from "../src/gui/window.js"
import {Category, Pos, Rule} from "../src/auto_tiling.js"
import {Key} from "../src/key.js"
import {ceil, removeFromArray, sqrt} from "../../RuWebQuest 2/src/functions.js"
import {readText} from "./loader.js"
import {getCategory, initParser} from "../src/parser.js"
import {copyCategoryKey, loadCategoryKey, moveCategoryKey} from "./keys.js"
import {confirm, enterString} from "./input.js"
import {drawDashedRegion, drawRect} from "./draw.js"
import {settings} from "./settings.js"

let currentCategory, currentRule

let selectKey = new Key("LMB")

export let rulesWindow = new Win("rules_window")
let tileSetCanvas = rulesWindow.addCanvas("tile_set_rules", 9, 16)
let rulesGridCanvas = rulesWindow.addCanvas("rules_grid", 9, 16)
let rulesListCanvas = rulesWindow.addCanvas("rules_list", 9, 16)

let addCategory = element("add_category") as HTMLButtonElement
let removeCategory = element("remove_category") as HTMLButtonElement
let renameCategory = element("rename_category") as HTMLButtonElement
let saveCategory = element("save_category") as HTMLButtonElement

let categoriesBox = element("category") as HTMLSelectElement

let addRule = element("add_rule") as HTMLButtonElement
let removeRule = element("remove_rule") as HTMLButtonElement
let moveRuleLeft = element("move_rule_left") as HTMLButtonElement
let moveRuleRight = element("move_rule_right") as HTMLButtonElement

rulesListCanvas.viewport.width = rulesListCanvas.node.offsetWidth
rulesListCanvas.viewport.height = rulesListCanvas.node.offsetHeight

categoriesBox.onchange = (event) => {
    currentCategory = event.target[(event.target as HTMLSelectElement).value].category
}

addCategory.onclick = () => {
    enterString("Введите имя новой категории:", "", (name) => {
        currentCategory = new Category(name)
        currentTileSet.categories.push(currentCategory)
        updateCategoriesList()
    })
}

removeCategory.onclick = () => {
    if(currentCategory === undefined) return
    confirm(`Действительно удалить категорию ${currentCategory.name}?`, () => {
        let categories = currentTileSet.categories
        removeFromArray(currentCategory, categories)
        currentCategory = categories.length > 0 ? categories[0] : undefined
        updateCategoriesList()
    })
}

renameCategory.onclick = () => {
    if(currentCategory === undefined) return
    enterString("Введите имя категории:", currentCategory.name, (name) => {
        currentCategory.name = name
        updateCategoriesList()
    })
}

saveCategory.onclick = () => {
    enterString("Введите имя категории:", currentCategory.name, (name) => {
        let text = currentCategory.normalized(name)
        const electron = window["electron"]
        if(electron !== undefined) {
            electron.saveDialog('showSaveDialog', {
                filters: [{ name: 'Auto tiling category', extensions: ['fatc']}],}).then(result => {
                if(result.canceled) return
                electron.saveFile(result.filePath, text)
            })
        } else {
            localStorage.setItem("categories", text)
        }
    })
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

    let categories = currentTileSet.categories
    if(!categories.includes(currentCategory) || currentCategory === undefined) {
        currentCategory = categories[0]
    }
    for(let i = 0; i < categories.length; i++) {
        let category = categories[i]
        let option = document.createElement("option")
        option["category"] = category
        option.value = i.toString()
        option.innerHTML = category.name
        categoriesBox.appendChild(option)
        if(category === currentCategory) option.selected = true
    }
}


tileSetCanvas.render = () => {
    renderTileSetCanvas(300, 100)

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
            drawRect((pos.dx + gridSize) * cellSize, (pos.dy + gridSize) * cellSize
                , cellSize, cellSize, settings.tileSet.rule)
        }

        currentTileSet.image(currentRule.tile).drawResized(gridSize * cellSize + 1
            , gridSize * cellSize + 1, cellSize - 1, cellSize - 1)
    }

    if(canvasUnderCursor !== rulesGridCanvas) return

    drawDashedRegion(Math.floor(canvasMouse.x / cellSize) * cellSize + 4
        , Math.floor(canvasMouse.y / cellSize) * cellSize + 4, cellSize - 6, cellSize - 6)
}


let rulesListTilesPerRow = 8

rulesListCanvas.render = () =>  {
    if(currentCategory === undefined) return

    ctx.canvas.width = rulesListCanvas.node.offsetWidth
    ctx.canvas.height = rulesListCanvas.node.offsetHeight

    const viewport = rulesListCanvas.viewport
    viewport.width = rulesListCanvas.node.offsetWidth
    viewport.height = rulesListCanvas.node.offsetHeight

    const rules = currentCategory.rules
    rulesListTilesPerRow = ceil(sqrt(rules.length / viewport.height * viewport.width))
    let size = rulesListCanvas.viewport.width / rulesListTilesPerRow
    for(let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        const x = (i % rulesListTilesPerRow) * size
        const y = (Math.floor(i / rulesListTilesPerRow)) * size

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
    if(selectKey.keyWasPressed) {
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
    function getTileNum() {
        let x = Math.floor(canvasMouse.x / tileWidth)
        let y = Math.floor(canvasMouse.y / tileHeight)
        return x + y * currentTileSet.columns
    }

    if(canvasUnderCursor !== tileSetCanvas) return

    if(loadCategoryKey.wasPressed) {
        const tileNum = getTileNum()
        readText((e) => {
            initParser(e.target.result)
            currentCategory = getCategory()
            currentCategory.convert(currentTileSet.columns)
            currentCategory.move(tileNum)
            currentTileSet.categories.push(currentCategory)
            updateCategoriesList()
        })
        return
    }

    if(currentCategory !== undefined) {
        const d = getTileNum() - currentCategory.getCorner()

        if(copyCategoryKey.wasPressed) {
            enterString("Введите имя новой категории:", currentCategory.name, (name) => {
                currentCategory = currentCategory.copy(name, d)
                currentTileSet.categories.push(currentCategory)
                updateCategoriesList()
            })
        }

        if(moveCategoryKey.wasPressed) {
            currentCategory.move(d)
        }
    }

    if(!selectKey.keyWasPressed || currentRule === undefined) return
    currentRule.tile = getTileNum()
}

rulesListCanvas.update = () => {
    if(canvasUnderCursor !== rulesListCanvas || currentCategory === undefined
        || !selectKey.keyWasPressed) return

    const size = rulesListCanvas.viewport.width / rulesListTilesPerRow
    const x = Math.floor(canvasMouse.x / size)
    const y = Math.floor(canvasMouse.y / size)
    const rules = currentCategory.rules
    const ruleNum = x + y * rulesListTilesPerRow
    if(ruleNum < rules.length) {
        currentRule = rules[ruleNum]
    }
}