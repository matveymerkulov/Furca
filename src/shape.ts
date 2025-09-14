import {Box} from "./box.js";
import {Sprite} from "./sprite.js";
import {Point} from "./point.js";
import {TileMap} from "./tile_map.js";
import {TileSet} from "./tile_set.js";
import {ShapeType} from "./shape_type"

export type SpriteProcessor = (sprite: Point) => void
export type SpriteCollisionProcessor = (x: number, y: number, sprite: Point) => void
export type TileCollisionProcessor = (shape: Shape, tileNum: number, x: number, y: number) => void

export class Shape {
    draw() {}

    copy(dx = 0, dy = 0): Shape {
        return undefined
    }

    update() {}

    remove(object: Shape) {}

    drawResized(sx: number, sy: number, swidth: number, sheight: number, shapeType: ShapeType) {}

    drawRotated(sx: number, sy: number, swidth: number, sheight: number, shapeType: ShapeType, angle: number, flipped: boolean) {}

    drawDashedRegion(isCircle: boolean) {}

    setPositionAs(sprite: Point) {}

    move() {}

    moveHorizontally() {}

    moveVertically() {}

    shift(dx: number, dy: number) {}

    wrap(bounds: Box) {}

    setAngleAs(sprite: Sprite) {}

    turn(value: number) {}

    turnImage(angle: number) {}

    processSprites(code: SpriteProcessor) {}

    findTileMapByTileSet(tileSet: TileSet): TileMap {
        return undefined
    }

    // collisions

    firstCollisionWithPoint(x: number, y: number): Shape {
        return undefined
    }

    collidesWithPoint(x: number, y: number) {
        return false
    }

    collisionWithSprite(sprite: Sprite, code: SpriteCollisionProcessor) {
    }

    collisionWithTileMap(tileMap: TileMap, code: TileCollisionProcessor) {
    }

    collisionWithPoint(x: number, y: number, code: SpriteCollisionProcessor) {
    }

    overlaps(box: Box) {
        return false
    }

    isInside(box: Box) {
        return false
    }
}