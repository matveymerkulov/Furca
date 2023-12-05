import {removeFromArray} from "./system.js"
import {Renderable} from "./renderable.js"

export default class Layer extends Renderable {
    constructor(...items) {
        super()
        this.items = items
        this.visible = true
        this.active = true
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

    isEmpty() {
        return this.items.length === 0
    }

    clear() {
        this.items = []
    }

    add(...objects) {
        Array.prototype.push.apply(this.items, objects)
    }

    remove(object) {
        removeFromArray(object, this.items)
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
}