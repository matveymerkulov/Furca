import {tileMaps} from "../src/project.js"
import {getName} from "./names.js"
import {ctx, xToScreen, yToScreen} from "../src/canvas.js"
import {drawCross} from "./draw.js"
import {selected, selector} from "./select.js"
import {centerX, centerY, currentMode, currentTileSprite, mode, tileMapUnderCursor} from "./main.js"

export function renderMaps() {
    tileMaps.items.forEach(map => {
        map.draw()
        let name = getName(map)
        ctx.fillStyle = "white"
        ctx.font = "16px serif"
        // noinspection JSCheckFunctionSignatures
        let metrics = ctx.measureText(name)
        // noinspection JSCheckFunctionSignatures
        ctx.fillText(name, xToScreen(map.x) - 0.5 * metrics.width
            , yToScreen(map.topY) - 0.5 * metrics.actualBoundingBoxDescent - 4)
    })

    switch(currentMode) {
        case mode.tiles:
            if(currentTileSprite !== undefined) {
                currentTileSprite.drawDashedRect()
            }

            if(tileMapUnderCursor !== undefined) {
                let x = tileMapUnderCursor.leftX + centerX
                let y = tileMapUnderCursor.topY + centerY
                drawCross(x, y, 2, "black")
                drawCross(x, y, 1, "white")
            }
            break
        case mode.maps:
            if(selector !== undefined) {
                selector.drawDashedRect()
            } else if(selected.length > 0) {
                for(let map of selected) {
                    map.drawDashedRect()
                }
            } else if(tileMapUnderCursor !== undefined) {
                tileMapUnderCursor.drawDashedRect()
            }
            break
    }
}