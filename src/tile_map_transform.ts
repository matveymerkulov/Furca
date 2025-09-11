import {TileMap} from "./tile_map.js";

export function transformTileMap(tileMap: TileMap, centerX = 0.5 * tileMap.columns
                                 , centerY = 0.5 * tileMap.rows, mirrorHorizontally: boolean
                                 , mirrorVertically: boolean, swap: boolean) {
    centerX -= 0.5
    centerY -= 0.5
    let newArray = new Array(tileMap.rows * tileMap.columns).fill(-1)
    let newK = swap ? tileMap.columns : tileMap.rows
    for(let y = 0; y < tileMap.rows; y++) {
        for(let x = 0; x < tileMap.columns; x++) {
            let newX = x - centerX
            let newY = y - centerY
            newX = mirrorHorizontally ? -newX : newX
            newY = mirrorVertically ? -newY : newY
            if(swap) [newX, newY] = [newY, newX]
            newX += centerX
            newY += centerY
            if(newX < 0 || newX >= tileMap.columns) continue
            if(newY < 0 || newY >= tileMap.rows) continue
            newArray[newX + newK * newY] = tileMap.tileByPos(x, y)
        }
    }
    //if(swap) [tileMap.#columns, tileMap.#rows] = [tileMap.#rows, tileMap.#columns]
    tileMap.setArray(newArray)
}

export function turnTileMapClockwise(tileMap: TileMap, centerX: number, centerY: number) {
    transformTileMap(tileMap, centerX, centerY, false, true, true)
}

export function turnTileMapCounterclockwise(tileMap: TileMap, centerX: number, centerY: number) {
    transformTileMap(tileMap, centerX, centerY, true, false, true)
}

export function mirrorTileMapHorizontally(tileMap: TileMap, centerX: number, centerY: number) {
    transformTileMap(tileMap, centerX, centerY, true, false, false)
}

export function mirrorTileMapVertically(tileMap: TileMap, centerX: number, centerY: number) {
    transformTileMap(tileMap, centerX, centerY, false, true, false)
}