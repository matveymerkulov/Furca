import {project} from "../../src/project.js"
import {Container} from "../../src/container.js"
import {Move} from "../../src/actions/sprite/move.js"
import {Interval} from "../../src/actions/interval.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import Generator from "./generator.js"
import {rnd} from "../../src/functions.js"
import {ShapeType, Sprite} from "../../src/sprite.js"
import {app, getViewport, initApp, initSystem, loadTexture, stage} from "../../src/system.js"
import {Box} from "../../src/box.js"

(async () => {
    await initApp()

    const showFlake = loadTexture("snowflake.png")

    project.init = () => {
        stage.scale = 100
        let flakes = new Container()
        stage.addChild(flakes)

        let viewport = getViewport()
        let generator = new Generator(showFlake, new Box(
            viewport.x, viewport.y - 0.5 * viewport.height - 3,viewport.width + 3, 2), ShapeType.box)

        const move = new Move()
        const remover = new RemoveIfOutside(new Box(0, 0,
            viewport.width + 6,viewport.height + 6))

        let interval = new Interval(0.05)

        project.update = () => {
            flakes.applyAction(move)
            flakes.applyAction(remover)

            if(interval.active()) {
                let flake = generator.execute()
                flake.setSize(rnd(0.5, 2))
                flake.dy = rnd(0.5, 2)
                flakes.addChild(flake)
            }
        }
    }

    initSystem()
})()


