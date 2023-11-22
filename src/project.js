import Layer from "./layer.js"

export let project = {
    locale: "en",
    locales: {},
    key: {},
    scene: new Layer(),
    actions: [],
    registry: {},
    sound: {},

    draw() {
        if(this.canvas !== undefined) this.canvas.draw()
    },
    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}