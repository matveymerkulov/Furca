import {Layer} from "./layer.js"
import {currentCanvas} from "./canvas.js"
import {TileMap} from "./tile_map.js";
import {TileSet} from "./tile_set.js";
import {ImageArray} from "./image_array.js";
import {Action} from "./actions/action"

export let tileSet: Map<string, TileSet>, tileMap: Map<string, TileMap>, layer: Map<string, Layer>
    , world: Layer, imageArray: Map<string, ImageArray>

export function initData() {
    imageArray = new Map()
    tileSet = new Map()
    tileMap = new Map()
    layer = new Map()
    world = new Layer()
}

export function setWorld(newWorld: Layer) {
    world = newWorld
}

export let project = {
    texturePath: "",
    textures: new Array<string>(),
    soundPath: "",
    sounds: new Array<string>(),
    locale: "en",
    locales: new Map<string, any>(),
    scene: new Layer(),
    actions: new Array<Action>(),

    render() {
    },

    renderNode() {
        this.render()
        currentCanvas.renderNode()
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