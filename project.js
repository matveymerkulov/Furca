export let project = {
    locale: "en",
    locales: {},
    key: {},
    scene: [],
    actions: [],
    registry: {},
    sound: {},

    getAssets() {
        return {texture: {}, sound: {}}
    },
    init: (texture) => {},
    update: () => {},
}