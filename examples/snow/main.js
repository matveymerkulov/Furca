import {project} from "../../src/project.js"
import Layer from "../../src/layer.js"
import Move from "../../src/actions/sprite/move.js"
import Box from "../../src/box.js"
import {currentCanvas} from "../../src/canvas.js"
import Interval from "../../src/actions/interval.js"
import Generator from "../../src/actions/generator.js"
import Img from "../../src/image.js"
import {rad, rnd} from "../../src/system.js"
import RemoveIfOutside from "../../src/actions/sprite/remove_if_outside.js"
import {ShapeType} from "../../src/shape_type.js"

project.getAssets = () => {
    return {
        texture: {
            flake: "snowflake.png",
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    let flakes = new Layer()
    let generator = new Generator(new Img(texture.flake), new Box(0, currentCanvas.topY - 3, currentCanvas.width + 3
        , 2), ShapeType.box)

    project.background = "rgb(9, 44, 84)"

    project.scene.add(flakes)

    project.actions = [
        new Move(flakes),
        new RemoveIfOutside(flakes, new Box(0, 0, currentCanvas.width + 6, currentCanvas.height + 6)),
    ]

    let interval = new Interval(0.05)

    project.update = () => {
        if(interval.active()) {
            let flake = generator.execute()
            flake.size = rnd(0.5, 2)
            flake.angle = rad(90)
            flake.speed = rnd(0.5, 2)
            flakes.add(flake)
        }
    }
}