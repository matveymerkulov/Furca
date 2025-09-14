import {project} from "../../src/project.js"
import {Layer} from "../../src/layer.js"
import {Move} from "../../src/actions/sprite/move.js"
import {Box} from "../../src/box.js"
import {currentCanvas} from "../../src/canvas.js"
import {Interval} from "../../src/actions/interval.js"
import {Img} from "../../src/image.js"
import {defaultCanvas, texture} from "../../src/system.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import Generator from "./generator.js"
import {rnd} from "../../../RuWebQuest 2/src/functions.js"
import {Sprite} from "../../src/sprite.js";
import {Shape} from "../../src/shape.js";
import {ShapeType} from "../../src/shape_type"

project.textures = ["snowflake.png"]

project.init = () => {
    defaultCanvas(16, 16)
    currentCanvas.background = "rgb(9, 44, 84)"

    let flakes = new Layer<Sprite>()
    let generator = new Generator(new Img(texture["snowflake"]), new Box(0
        , currentCanvas.top - 3, currentCanvas.width + 3, 2), ShapeType.box)

    project.scene.add(flakes)

    project.actions = [
        new Move(flakes),
        new RemoveIfOutside<Sprite>(flakes, new Box(0, 0, currentCanvas.width + 6, currentCanvas.height + 6)),
    ]

    let interval = new Interval(0.05)

    project.update = () => {
        if(interval.active()) {
            let flake = generator.execute()
            flake.size = rnd(0.5, 2)
            flake.dy = rnd(0.5, 2)
            flakes.add(flake)
        }
    }
}