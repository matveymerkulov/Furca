import {rad} from "../../RuWebQuest 2/src/functions.js"

export const settings = {
    tileSet: {
        block: {
            color: "lightgreen",
            lineWidth: 2,
            padding: 2,
            outline: {
                color: "green",
                lineWidth: 4,
            }
        },

        frame: {
            color: "red",
            lineWidth: 2,
            padding: 2,
            outline: {
                color: "darkred",
                lineWidth: 4,
            }
        },

        visibility: {
            type: "x",
            color: "white",
            lineWidth: 3,
            size: 5,
            outline: {
                color: "black",
                lineWidth: 5,
                size: 6,
            }
        },

        rule: {
            color: "black",
            lineWidth: 1,
            padding: 6,
            outline: {
                color: "white",
                lineWidth: 2,
            }
        },
    },

    pivot: {
        type: "o",
        color: "white",
        size: 4,
        diameter: 7,
        outline: {
            color: "black",
            size: 7,
        },
        arrow: {
            lineWidth: 2,
            pointerLength: 9,
            angle: rad(150),
        }
    }
}