import Layer from "./layer.js"
import {currentCanvas} from "./canvas.js"

export let tileSet, tileMap, tileMaps

export function initData() {
    tileSet = {}
    tileMap = {}
    tileMaps = new Layer()
}

export function setTileSets(tiles) {
    tileSet = tiles
}

export function setTileMaps(map) {
    tileMap = map
}

export function setScene(scene) {
    tileMaps = scene
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