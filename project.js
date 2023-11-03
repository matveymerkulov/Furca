export let project = {
    locale: "en",
    locales: {},
    key: {},
    scene: [],
    actions: [],
    registry: {},
    sound: {},
    background: "rgb(0, 0, 0)",

    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}