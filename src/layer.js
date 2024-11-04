import {Renderable} from "./renderable.js"
import {addIndent, indent, removeIndent} from "./save_load.js"
import {removeFromArray} from "./functions.js"
import {distToScreen, xToScreen, yToScreen} from "./canvas.js"
import {Box} from "./box.js"

export class Layer extends Renderable {
    constructor(...items) {
        super()
        this.items = items
        this.visible = true
        this.active = true
    }

    copy(dx = 0, dy = 0) {
        const newLayer = new Layer()
        for(let item of this.items) {
            newLayer.add(item.copy(dx, dy))
        }
        return newLayer
    }

    toString() {
        let text = `new Layer(`
        addIndent()
        this.items.forEach(item => {
            text += `\n${indent}${item.toString()},`
        })
        removeIndent()
        return `${text}${indent})`
    }

    get isLayer() {
        return true
    }

    draw() {
        if(!this.visible) return
        for(const item of this.items) {
            item.draw()
        }
    }

    drawDashedRegion(isCircle) {
        for(const item of this.items) {
            item.drawDashedRegion(isCircle)
        }
    }

    update() {
        if(!this.active) return
        for(const item of this.items) {
            item.update()
        }
    }

    // items management

    get quantity() {
        return this.items.length
    }

    get isEmpty() {
        return this.items.length === 0
    }

    clear() {
        this.items = []
    }

    has(item) {
        return this.items.includes(item)
    }

    add(...objects) {
        Array.prototype.push.apply(this.items, objects)
    }

    replace(index, object) {
        this.items[index] = object
    }

    remove(object) {
        for(let item of this.items) {
            if(item === object) {
                removeFromArray(object, this.items)
                return
            }
            if(item.remove !== undefined) item.remove(object)
        }

    }

    removeAll(itemsToRemove) {
        for(const item of itemsToRemove) {
            this.remove(item)
        }
        itemsToRemove.length = 0
    }

    // sprite manipulations

    move() {
        for(const item of this.items) {
            item.move()
        }
    }

    setPositionAs(sprite) {
        for(const item of this.items) {
            item.setPositionAs(sprite)
        }
    }

    loop(bounds) {
        for(const item of this.items) {
            item.loop(bounds)
        }
    }

    turn(angle) {
        for(const item of this.items) {
            item.turn(angle)
        }
    }

    turnImage(angle) {
        for(const item of this.items) {
            item.turnImage(angle)
        }
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    processSprites(code) {
        for(const item of this.items) {
            item.processSprites(code)
        }
    }

    findTileMapByTileSet(tileSet) {
        for(const item of this.items) {
            if(item.tileSet === tileSet) return item
        }
    }

    // collisions

    firstCollisionWithPoint(x, y) {
        for(let item of this.items) {
            let collided = item.firstCollisionWithPoint(x, y)
            if(collided !== undefined) {
                return collided
            }
        }
        return undefined
    }

    collidesWithPoint(x, y) {
        for(let item of this.items) {
            if(item.collidesWithPoint(x, y)) return true
        }
        return false
    }

    collisionWith(object, code) {
        this.items.forEach(item => item.collisionWith(object, code))
    }

    collisionWithSprite(sprite, code) {
        this.items.forEach(item => item.collisionWithSprite(sprite, code))
    }

    collisionWithTileMap(tileMap, code) {
        this.items.forEach(item => item.collisionWithTileMap(tileMap, code))
    }

    collisionWithPoint(x, y, code) {
        this.items.forEach(item => item.collisionWithPoint(x, y, code))
    }

    overlaps(box) {
        for(let item of this.items) {
            if(item.overlaps(box)) return true
        }
    }

    isInside(box) {
        for(let item of this.items) {
            if(!item.isInside(box)) return false
        }
        return true
    }
}