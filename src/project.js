import Layer from "./layer.js"
import {currentCanvas} from "./canvas.js"

export let project = {
    locale: "en",
    locales: {},
    scene: new Layer(),
    actions: [],
    sound: {},

    draw: () => {
        if(currentCanvas !== undefined) currentCanvas.draw()
    },
    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}