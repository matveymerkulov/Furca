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
    texture: null,

    render() {
    },

    renderNode() {
        this.render()
        currentCanvas.renderNode()
    },

    getAssets() {
        return {texture: {}, sound: {}}
    },

    init: () => {},

    update() {
    },

    updateNode() {
        this.update()
        this.actions.forEach(action => {
            action.execute()
        })
        this.scene.update()
    },
}