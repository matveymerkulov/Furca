import {project} from "../../project.js"
import Img from "../../image.js"
import Sprite from "../../sprite.js"
import {apsk, rad, randomSign, rnd} from "../../system.js"
import Layer from "../../layer.js"

project.locales.en = {
}

project.locales.ru = {
}

project.key = {
}

project.getAssets = () => {
    return {
        texture: {
            particle: "particle.png"
        },
        sound: {
        }
    }
}

const dyFrom = -10, dyTo = -8
const dxFrom = 1, dxTo = 2
const mainShotY = 10
const gravity = 3
const tailLength = 20

project.init = (texture) => {
    let image = new Img(texture.particle, 0, 0)
    let shots = new Layer()
    let dx = rnd(dxFrom, dxTo) * randomSign()
    let dy = rnd(dyFrom, dyTo)

    let x = 0
    let y = mainShotY
    for(let i = 0; i < tailLength; i++) {
        let shot = new Sprite(image, x, y)
        shot.size = i / tailLength
        shot.dx = dx
        shot.dy = dy
        x += dx * apsk
        y += dy * apsk
        dy += apsk * gravity
        shots.add(shot)
    }

    project.background = "rgb(9, 44, 84)"

    project.registry = {
    }

    project.scene = [
        shots
    ]

    project.actions = [
    ]

    project.update = () => {
        for(let shot of shots.items) {
            shot.moveTo(shot.centerX + shot.dx * apsk, shot.centerY + shot.dy * apsk)
            shot.dy = shot.dy + apsk * gravity
        }
    }
}