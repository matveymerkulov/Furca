import {currentTileSet} from "./tile_set.js"
import {blocksTileSetCanvas, rulesGrid, rulesTileSetCanvas, tileHeight, tileWidth} from "./main.js"
import {renderTileSetCanvas} from "./tile_set_properties.js"
import {visibility} from "../src/tile_set.js"
import {drawX} from "./draw.js"
import {ctx, currentCanvas} from "../src/canvas.js"
import {element} from "../src/system.js"

let currentCategory, currentRule

class Category {
    rules = []
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

export function renderRulesTileSet() {
    renderTileSetCanvas(rulesTileSetCanvas)

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
}

export function renderRulesList() {

}

export function updateRulesWindow() {

}