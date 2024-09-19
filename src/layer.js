import {Renderable} from "./renderable.js"
import {addIndent, indent, removeIndent} from "./save_load.js"
import {removeFromArray} from "./functions.js"
import {bullets, deadBullets} from "../breakout/main.js"

export class Layer extends Renderable {
    constructor(...items) {
        super()
        this.items = items
        this.visible = true
        this.active = true
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

    draw() {
        if(this.visible) {
            this.items.forEach(item => item.draw())
        }
    }

    update() {
        if(this.active) {
            this.items.forEach(item => item.update())
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
        removeFromArray(object, this.items)
    }

    removeAll(itemsToRemove) {
        if(itemsToRemove.length > 0) {
            for(let item of itemsToRemove) {
                this.remove(item)
            }
            itemsToRemove.length = 0
        }
    }

    // sprite manipulations

    move() {
        this.items.forEach(item => item.move())
    }

    setPositionAs(sprite) {
        this.items.forEach(item => item.setPositionAs(sprite))
    }

    loop(bounds) {
        this.items.forEach(item => item.loop(bounds))
    }

    turn(angle) {
        this.items.forEach(item => item.turn(angle))
    }

    turnImage(angle) {
        this.items.forEach(item => item.turnImage(angle))
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
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

    collisionWith(object, code) {
        this.items.forEach(item => item.collisionWith(object, code))
    }

    collisionWithSprite(sprite, code) {
        this.items.forEach(item => item.collisionWithSprite(sprite, code))
    }

    collisionWithTilemap(tilemap, code) {
        this.items.forEach(item => item.collisionWithTilemap(tilemap, code))
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
            if(item.isInside(box)) return true
        }
    }
}