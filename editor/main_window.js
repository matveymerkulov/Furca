import {Win} from "../src/gui/window.js"
import Key from "../src/key.js"
import {currentTileSet} from "./tile_set.js"
import {resetRegionSelector} from "./select_tile_set_region.js"
import {rulesWindow, updateCategoriesList} from "./auto_tiling.js"
import {tileSetPropertiesWindow} from "./tile_set_properties.js"
import {projectFromStorage, projectToStorage} from "./save_load.js"
import {initData} from "../src/project.js"
import {newMap} from "./new_map.js"

export let mainWindow = new Win("main")

let tileSetPropertiesKey = new Key("KeyI")
let autoTilingEditorKey = new Key("KeyA")

mainWindow.update = () => {
    if(currentTileSet === undefined) return

    if(tileSetPropertiesKey.wasPressed) {
        resetRegionSelector()
        tileSetPropertiesWindow.show()
    }

    if(autoTilingEditorKey.wasPressed) {
        rulesWindow.show()
        updateCategoriesList()
    }
}