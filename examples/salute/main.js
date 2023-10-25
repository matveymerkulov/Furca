import {project} from "../../project.js"
import Img from "../../image.js"
import Sprite from "../../sprite.js"
import {apsk, ctx, rad, randomSign, removeFromArray, rnd, rndi} from "../../system.js"
import Layer from "../../layer.js"
import SetBounds from "../../actions/sprite/set_bounds.js"
import {currentCanvas, distToScreen, xToScreen, yToScreen} from "../../canvas.js"

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

const dyFrom = -20, dyTo = -15
const dxFrom = 0.5, dxTo = 1.5
const mainShotY = 10
const gravity = 10
const dyThreshold = 10
const tailLength = 20
const particlesQuantity = 100

project.init = (texture) => {
    let particles = new Layer()
    particles.isShot = false

    let image = new Img(texture.particle, 0, 0)
    let draw = function () {
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(xToScreen(this.centerX), yToScreen(this.centerY), distToScreen(0.25), 0, rad(360))
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.globalAlpha = 1
    }

    project.background = "rgb(9, 44, 84)"

    project.registry = {
    }

    project.scene = [
        particles,
    ]

    project.actions = [
        new SetBounds(particles, currentCanvas)
    ]

    project.update = () => {
        if(rnd(0, 1) < 0.02) {
            let shots = new Layer()
            shots.isShot = true
            project.scene.push(shots)

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
        }

        for(let layer of project.scene) {
            for (let shot of layer.items) {
                shot.moveTo(shot.centerX + shot.dx * apsk, shot.centerY + shot.dy * apsk)
                shot.dy = shot.dy + apsk * gravity
                if(shot.fadingSpeed !== undefined) {
                    shot.opacity -= shot.fadingSpeed * apsk
                    if(shot.opacity < 0) shot.opacity = 0
                }
                if (shot.dy > dyThreshold && layer.isShot) {
                    removeFromArray(layer, project.scene)
                    let color = `rgb(${rndi(256)},${rndi(256)},${rndi(256)})`
                    for (let i = 0; i < particlesQuantity; i++) {
                        let particle = new Sprite(image, shot.centerX, shot.centerY)
                        particle.draw = draw
                        let angle = rnd(rad(360))
                        let length = Math.sqrt(rnd(0, 1)) * 5
                        particle.dx = length * Math.cos(angle)
                        particle.dy = length * Math.sin(angle)
                        particle.fadingSpeed = rnd(0.5, 1)
                        particle.opacity = 1
                        particle.color = color
                        particles.add(particle)
                    }
                }
            }
        }
    }
}