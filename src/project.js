import {Layer} from "./layer.js"
import {currentCanvas} from "./canvas.js"

export let tileSet, tileMap, layer, world

export function initData() {
    tileSet = {}
    tileMap = {}
    layer = {}
    world = new Layer()
}

export function setWorld(newWorld) {
    world = newWorld
}

export let project = {
    locale: "en",
    locales: {},
    scene: new Layer(),
    actions: [],

    render() {
    },

    renderNode() {
        this.render()
        currentCanvas.renderNode()
    },

    getAssets() {
        return {texture: [], sound: []}
    },

    init: () => {},

    update() {
    },

    updateNode() {
        this.update()
        for(const action of this.actions) {
            action.execute()
        }
        this.scene.update()
    },
}