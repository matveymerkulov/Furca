import {arrayToString} from "./save_load.js"
import {floor} from "./functions.js"
import {TileMap} from "./tile_map.js"


export class Category {
    name
    rules
    prolong
    columns

    constructor(name: string, rules = [], prolong = false, columns = undefined) {
        this.name = name
        this.rules = rules
        this.prolong = prolong
        this.columns = columns
    }

    copy(newName: string, d: number) {
        let newRules = new Array(this.rules.length)
        for(let i = 0; i < newRules.length; i++) {
            newRules[i] = this.rules[i].copy(d)
        }
        return new Category(newName, newRules, this.prolong, this.columns)
    }

    move(d: number) {
        for(let rule of this.rules) {
            rule.move(d)
        }
    }

    convert(toColumns: number) {
        for(let rule of this.rules) {
            rule.convert(this.columns, toColumns)
        }
        this.columns = toColumns
    }

    getCorner() {
        let minColumn: number, minRow: number
        for(let rule of this.rules) {
            const column = rule.tile % this.columns
            const row = floor(rule.tile / this.columns)
            if(minColumn === undefined || column < minColumn) minColumn = column
            if(minRow === undefined || row < minRow) minRow = row
        }
        return minColumn + minRow * this.columns
    }

    normalized(newName: string) {
        let text = ""
        let d = this.getCorner()
        for(let rule of this.rules) {
            text += `\t${rule.normalized(d)}, \n`
        }

        return `new Category("${newName}", \n${text}, ${this.prolong}, ${this.columns})`
    }

    toString() {
        return `new Category("${this.name}", ${arrayToString(this.rules, 1)}, ${this.prolong}, ${this.columns})`
    }
}

export class Rule {
    tile: number
    positions: Pos[]

    constructor(tile = 0, positions: Pos[] = []) {
        this.tile = tile
        this.positions = positions
    }

    copy(d: number) {
        let newPositions = new Array(this.positions.length)
        for(let i = 0; i < newPositions.length; i++) {
            newPositions[i] = this.positions[i].copy()
        }
        return new Rule(this.tile + d, newPositions)
    }

    move(d: number) {
        this.tile += d
    }

    convert(fromColumns: number, toColumns: number) {
        const column = this.tile % fromColumns
        const row = floor(this.tile / fromColumns)
        this.tile = column + row * toColumns
    }

    normalized(d: number) {
        return `new Rule(${this.tile - d}, ${arrayToString(this.positions)})`
    }

    toString() {
        return `new Rule(${this.tile}, ${arrayToString(this.positions)})`
    }
}

export class Pos {
    dx: number
    dy: number

    constructor(dx: number, dy: number) {
        this.dx = dx
        this.dy = dy
    }

    copy() {
        return new Pos(this.dx, this.dy)
    }

    toString() {
        return `new Pos(${this.dx}, ${this.dy})`
    }
}

function findTileCategory(map: TileMap, column: number, row: number, prolong = false) {
    if(prolong) {
        if(column < 0) column = 0
        if(column >= map.columns) column = map.columns - 1
        if(row < 0) row = 0
        if(row >= map.rows) row = map.rows - 1
    } else {
        if(column < 0 || column >= map.columns || row < 0 ||row >= map.rows) return undefined
    }

    let tileNum = map.tileByPos(column, row)
    for(let category of map.tileSet.categories) {
        for(let rule of category.rules) {
            if(rule.tile === tileNum) return category
        }
    }
    return undefined
}

export function enframeTile(map: TileMap, column: number, row: number) {
    let tileCategory = findTileCategory(map, column, row, false)
    if(tileCategory === undefined) return
    let prolong = tileCategory.prolong
    rule: for(let rule of tileCategory.rules) {
        for(let pos of rule.positions) {
            let category = findTileCategory(map, pos.dx + column, pos.dy + row, prolong)
            if(category === tileCategory) continue rule
        }
        map.setTileByPos(column, row, rule.tile)
        return
    }
}

export function enframe(map: TileMap) {
    for(let row = 0; row < map.rows; row++) {
        for(let column = 0; column < map.columns; column++) {
            enframeTile(map, column, row)
        }
    }
}