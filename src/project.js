import Layer from "./layer.js"
import {currentCanvas} from "./canvas.js"
import {currentWindow, windows} from "./gui/window.js"
import {mainWindow} from "../editor/main_window.js"

export let tileSet, tileMap, tileMaps

export function initData() {
    tileSet = new Map()
    tileMap = new Map()
    tileMaps = new Layer()
}

export let project = {
    locale: "en",
    locales: {},
    scene: new Layer(),
    actions: [],
    sound: {},
    texture: null,

    renderNode() {
        if(windows.size === 0) {
            currentCanvas.renderNode()
        } else {
            mainWindow.renderNode()
            if(currentWindow === undefined || currentWindow === mainWindow) return
            currentWindow.renderNode()
        }
    },

    getAssets() {
        return {texture: {}, sound: {}}
    },

    init: () => {},
    updateNode: () => {
        if(windows.size === 0) {
            this.scene.update()
        } else {
            mainWindow.updateNode()
            if(currentWindow === undefined) return
            currentWindow.updateNode()
        }
    },
}