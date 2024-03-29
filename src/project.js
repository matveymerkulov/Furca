import Layer from "./layer.js"
import {currentCanvas} from "./canvas.js"

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

    render() {
        currentCanvas.render()
    },
    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {
        this.scene.update()
    },
}