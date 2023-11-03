import {project} from "../../project.js"
import {ShapeType} from "../../shape_type.js"
import {currentCanvas} from "../../canvas.js"
import Sprite from "../../sprite.js"
import Shape from "../../shape.js"
import Generator from "../../actions/generator.js"
import Img from "../../image.js"
import Box from "../../box.js"

project.locales.en = {
}

project.locales.ru = {
}

project.key = {
}

project.getAssets = () => {
    return {
        texture: {
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    let defaultColor = "rgb(0, 128, 0)"
    let collisionColor = "rgb(128, 255, 128)"

    let circle = new Sprite(new Shape(defaultColor), 0, -2, 2, 2, ShapeType.circle)
    let box = new Sprite(new Shape(defaultColor), 0, 2, 2, 2, ShapeType.box)

    project.scene = [
        circle,
        box,
    ]

    project.actions = [
    ]

    project.update = () => {

    }
}