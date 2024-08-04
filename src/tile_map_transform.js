export function transformTileMap(tileMap, centerX = 0.5 * tileMap.columns, centerY = 0.5 * tileMap.rows, mirrorHorizontally
    , mirrorVertically, swap) {
    centerX -= 0.5
    centerY -= 0.5
    let newArray = new Array(tileMap.rows * tileMap.columns).fill(0)
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

export function turnTileMapClockwise(tileMap, centerX, centerY) {
    transformTileMap(tileMap, centerX, centerY, false, true, true)
}

export function turnTileMapCounterclockwise(tileMap, centerX, centerY) {
    transformTileMap(tileMap, centerX, centerY, true, false, true)
}

export function mirrorTileMapHorizontally(tileMap, centerX, centerY) {
    transformTileMap(tileMap, centerX, centerY, true, false, false)
}

export function mirrorTileMapVertically(tileMap, centerX, centerY) {
    transformTileMap(tileMap, centerX, centerY, false, true, false)
}