import {arrayToString} from "./save_load.js"


export class Category {
    name
    rules
    prolong

    constructor(name, rules = [], prolong = false) {
        this.name = name
        this.rules = rules
        this.prolong = prolong
    }

    copy(newName, d) {
        let newRules = new Array(this.rules.length)
        for(let i = 0; i < newRules.length; i++) {
            newRules[i] = this.rules[i].copy(d)
        }
        return new Category(newName, newRules, this.prolong)
    }

    toString() {
        return `new Category("${this.name}", ${arrayToString(this.rules, 1)}, ${this.prolong})`
    }
}

export class Rule {
    tile
    positions

    constructor(tile = 0, positions = []) {
        this.tile = tile
        this.positions = positions
    }

    copy(d) {
        let newPositions = new Array(this.positions.length)
        for(let i = 0; i < newPositions.length; i++) {
            newPositions[i] = this.positions[i].copy()
        }
        return new Rule(this.tile + d, newPositions)
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

    copy() {
        return new Pos(this.dx, this.dy)
    }

    toString() {
        return `new Pos(${this.dx}, ${this.dy})`
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

    let tileNum = map.tileByPos(column, row)
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
        map.setTileByPos(column, row, rule.tile)
        return
    }
}

export function enframe(map) {
    for(let row = 0; row < map.rows; row++) {
        for(let column = 0; column < map.columns; column++) {
            enframeTile(map, column, row)
        }

    }

}