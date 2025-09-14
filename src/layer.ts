import {addIndent, indent, removeIndent} from "./save_load.js"
import {removeFromArray} from "./functions.js"
import {Point} from "./point.js";
import {Sprite} from "./sprite.js";
import {TileMap} from "./tile_map.js";
import {Shape, SpriteCollisionProcessor, SpriteProcessor, TileCollisionProcessor} from "./shape.js";
import {Box} from "./box.js";
import {TileSet} from "./tile_set.js";

export class Layer extends Shape {
    visible = true
    active = true
    items: any[]

    constructor(...items: any[]) {
        super()
        this.items = items
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
        for (const item of this.items) {
            text += `\n${indent}${item.toString()},`
        }
        removeIndent()
        return `${text}${indent})`
    }

    draw() {
        if(!this.visible) return
        for(const item of this.items) {
            item.draw()
        }
    }

    drawDashedRegion(isCircle: boolean) {
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

    has(item: any) {
        return this.items.indexOf(item) >= 0
    }

    add(...objects: Shape[]) {
        Array.prototype.push.apply(this.items, objects)
    }

    replace(index: number, object: any) {
        this.items[index] = object
    }

    remove(object: Shape) {
        for(let item of this.items) {
            if(item === object) {
                removeFromArray(object, this.items)
                return
            }
            item.remove(object)
        }

    }

    removeAll(itemsToRemove: any[]) {
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

    setPositionAs(sprite: Point) {
        for(const item of this.items) {
            item.setPositionAs(sprite)
        }
    }

    wrap(bounds: Box) {
        for(const item of this.items) {
            item.wrap(bounds)
        }
    }

    turn(angle: number) {
        for(const item of this.items) {
            item.turn(angle)
        }
    }

    turnImage(angle: number) {
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

    processSprites(code: SpriteProcessor) {
        for(const item of this.items) {
            item.processSprites(code)
        }
    }

    findTileMapByTileSet(tileSet: TileSet) {
        for(const item of this.items) {
            if(item instanceof TileMap && item.tileSet === tileSet) return item
        }
        return undefined
    }

    // collisions

    firstCollisionWithPoint(x: number, y: number) {
        for(let item of this.items) {
            let collided = item.firstCollisionWithPoint(x, y)
            if(collided !== undefined) {
                return collided
            }
        }
        return undefined
    }

    collidesWithPoint(x: number, y: number) {
        for(let item of this.items) {
            if(item.collidesWithPoint(x, y)) return true
        }
        return false
    }

    collisionWithSprite(sprite: Sprite, code: SpriteCollisionProcessor) {
        for (const item of this.items) {
            item.collisionWithSprite(sprite, code);
        }
    }

    collisionWithTileMap(tileMap: TileMap, code: TileCollisionProcessor) {
        this.items.forEach(item => item.collisionWithTileMap(tileMap, code))
    }

    collisionWithPoint(x: number, y: number, code: SpriteCollisionProcessor) {
        this.items.forEach(item => item.collisionWithPoint(x, y, code))
    }

    overlaps(box: Box) {
        for(let item of this.items) {
            if(item.overlaps(box)) return true
        }
        return false
    }

    isInside(box: Box) {
        for(let item of this.items) {
            if(!item.isInside(box)) return false
        }
        return true
    }
}