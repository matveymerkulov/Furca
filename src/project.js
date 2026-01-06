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