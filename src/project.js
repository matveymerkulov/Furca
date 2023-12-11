import Layer from "./layer.js"

export let project = {
    locale: "en",
    locales: {},
    scene: new Layer(),
    actions: [],
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