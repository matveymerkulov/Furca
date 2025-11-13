import {Container} from "./container.js"

export let tileSet, tileMap, layer, world, imageArray

export function initData() {
    imageArray = {}
    tileSet = {}
    tileMap = {}
    layer = {}
    world = new Container()
}

export function setWorld(newWorld) {
    world = newWorld
}

export let project = {
    locale: "en",
    locales: {},
    actions: [],

    init: () => {},

    render() {
    },

    update() {},

    updateNode() {
        this.update()
        for(const action of this.actions) {
            action.execute()
        }

    },
}