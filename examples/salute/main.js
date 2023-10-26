import {project} from "../../project.js"
import Img from "../../image.js"
import Sprite from "../../sprite.js"
import {apsk, ctx, rad, removeFromArray, rnd} from "../../system.js"
import Layer from "../../layer.js"
import SetBounds from "../../actions/sprite/set_bounds.js"
import {currentCanvas, distToScreen, xToScreen, yToScreen} from "../../canvas.js"
import Rnd from "../../function/rnd.js"

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

const shotdx = new Rnd(0.5, 1.5)
const shotdy = new Rnd(-19, -15)
const shotY = 10
const gravity = 10
const dyThreshold = 5
const tailLength = 20, tailStep = 0.01
const probability = 0.02
const shotSize = new Rnd(0.25, 0.5)
const particlesQuantity = new Rnd(50, 100)
const particleSpeed = new Rnd(5, 10)
const particleSize = new Rnd(0.25, 0.75)
const particleColor = new Rnd(128, 255)
const fadingSpeed = new Rnd(0.25, 0.5)

project.init = (texture) => {
    let particles = new Layer()
    particles.isShot = false

    let image = new Img(texture.particle, 0, 0)
    let draw = function () {
        ctx.globalAlpha = this.opacity
        let x = xToScreen(this.centerX)
        let y = yToScreen(this.centerY)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, distToScreen(this.halfWidth));
        gradient.addColorStop(0, `rgba(${this.color},255)`)
        gradient.addColorStop(1, `rgba(${this.color},0)`)
        ctx.fillStyle = gradient;
        ctx.fillRect(xToScreen(this.leftX), yToScreen(this.topY), distToScreen(this.width), distToScreen(this.height));
        ctx.fillStyle = "white"
        ctx.globalAlpha = 1
    }

    project.background = "rgb(9, 44, 84)"

    project.scene = [
        particles,
    ]

    project.actions = [
        new SetBounds(particles, currentCanvas)
    ]

    project.update = () => {
        if(rnd(0, 1) < probability) {
            let color = `${particleColor.toNumber()},${particleColor.toNumber()},${particleColor.toNumber()}`
            let shots = new Layer()
            shots.isShot = true
            shots.color = color
            project.scene.push(shots)

            let dx = shotdx.toNumber()
            let dy = shotdy.toNumber()
            let x = 0
            let y = shotY
            for(let i = 0; i < tailLength; i++) {
                let shot = new Sprite(image, x, y)
                shot.size = shotSize.toNumber() * i / tailLength
                shot.dx = dx
                shot.dy = dy
                shot.color = color
                shot.draw = draw
                x += dx * tailStep
                y += dy * tailStep
                dy += tailStep * gravity
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
                    let quantity = particlesQuantity.toNumber()
                    for (let i = 0; i < quantity; i++) {
                        let size = particleSize.toNumber()
                        let particle = new Sprite(image, shot.centerX, shot.centerY, size, size)
                        particle.draw = draw
                        let angle = rnd(rad(360))
                        let length = Math.sqrt(rnd(0, 1)) * particleSpeed.toNumber()
                        particle.dx = length * Math.cos(angle)
                        particle.dy = length * Math.sin(angle)
                        particle.fadingSpeed = fadingSpeed.toNumber()
                        particle.opacity = 1
                        particle.color = layer.color
                        particles.add(particle)
                    }
                }
            }
        }
    }
}