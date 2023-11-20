import Layer from "./layer.js"

export let project = {
    locale: "en",
    locales: {},
    key: {},
    scene: new Layer(),
    actions: [],
    registry: {},
    sound: {},
    background: "rgb(0, 0, 0)",

    draw() {
        if(this.canvas !== undefined) this.canvas.draw()
    },
    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}