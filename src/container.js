import {addIndent, indent, removeIndent} from "./save_load.js"


export class Container extends PIXI.Container {
    constructor(...children) {
        super()
        for(const child of children) {
            this.addChild(child)
        }
        this.active = true
    }

    copy(dx = 0, dy = 0) {
        const newContainer = new Container()
        for(let child of this.children) {
            newContainer.add(child.copy(dx, dy))
        }
        return newContainer
    }

    toString() {
        let text = `new Container(`
        addIndent()
        this.children.forEach(child => {
            text += `\n${indent}${child.toString()},`
        })
        removeIndent()
        return `${text}${indent})`
    }

    update() {
        if(!this.active) return
        for(const child of this.children) {
            child.update()
        }
    }

    // children management

    get quantity() {
        return this.children.length
    }

    get isEmpty() {
        return this.children.length === 0
    }

    clear() {
        this.removeChildren(0, this.children.length)
    }

    has(child) {
        return this.children.includes(child)
    }

    hide() {
        this.visible = false
    }

    show() {
        this.visible = true
    }

    applyAction(action) {
        for(const child of this.children) {
            child.applyAction(action)
        }

    }

    processSprites(code) {
        for(const child of this.children) {
            child.processSprites(code)
        }
    }

    findTileMapByTileSet(tileSet) {
        for(const child of this.children) {
            if(child.tileSet === tileSet) return child
        }
    }

    // collisions

    firstCollisionWithPoint(x, y) {
        for(let child of this.children) {
            let collided = child.firstCollisionWithPoint(x, y)
            if(collided !== undefined) {
                return collided
            }
        }
        return undefined
    }

    collidesWithPoint(x, y) {
        for(let child of this.children) {
            if(child.collidesWithPoint(x, y)) return true
        }
        return false
    }

    collisionWith(object, code) {
        this.children.forEach(child => child.collisionWith(object, code))
    }

    collisionWithSprite(sprite, code) {
        this.children.forEach(child => child.collisionWithSprite(sprite, code))
    }

    collisionWithTileMap(tileMap, code) {
        this.children.forEach(child => child.collisionWithTileMap(tileMap, code))
    }

    collisionWithPoint(x, y, code) {
        this.children.forEach(child => child.collisionWithPoint(x, y, code))
    }

    overlaps(sprite) {
        for(let child of this.children) {
            if(child.overlaps(sprite)) return true
        }
    }

    isInside(sprite) {
        for(let child of this.children) {
            if(!child.isInside(sprite)) return false
        }
        return true
    }
}