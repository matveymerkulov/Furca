import {Layer} from "./layer.js"
import {currentCanvas} from "./canvas.js"
import {TileMap} from "./tile_map.js";
import {TileSet} from "./tile_set.js";
import {ImageArray} from "./image_array.js";
import {Shape} from "./shape.js";

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
    textures: [],
    soundPath: "",
    sounds: [],
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