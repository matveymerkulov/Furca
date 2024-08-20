import {project} from "../../src/project.js"
import {Img} from "../../src/image.js"
import {Sprite} from "../../src/sprite.js"
import {apsk, defaultCanvas} from "../../src/system.js"
import {Layer} from "../../src/layer.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../../src/canvas.js"
import {Rnd} from "../../src/function/rnd.js"
import {rad, rnd} from "../../src/functions.js"

project.getAssets = () => {
    return {
        texture: ["particle.png"],
        sound: []
    }
}

const shotDX = new Rnd(0.5, 1.5)
const shotDY = new Rnd(-19, -15)
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
        let x = xToScreen(this.x)
        let y = yToScreen(this.y)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, distToScreen(this.halfWidth));
        gradient.addColorStop(0, `rgba(${this.color},255)`)
        gradient.addColorStop(1, `rgba(${this.color},0)`)
        ctx.fillStyle = gradient;
        ctx.fillRect(xToScreen(this.leftX), yToScreen(this.topY), distToScreen(this.width), distToScreen(this.height));
        ctx.fillStyle = "white"
        ctx.globalAlpha = 1
    }

    defaultCanvas(16, 16)
    currentCanvas.background = "rgb(9, 44, 84)"

    project.scene.add(particles)

    project.actions = [
        new RemoveIfOutside(particles, currentCanvas)
    ]

    project.update = () => {
        if(rnd(0, 1) < probability) {
            let color = `${particleColor.toNumber()},${particleColor.toNumber()},${particleColor.toNumber()}`
            let shots = new Layer()
            shots.isShot = true
            shots.color = color
            project.scene.add(shots)

            let dx = shotDX.toNumber()
            let dy = shotDY.toNumber()
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

        for(let layer of project.scene.items) {
            for (let shot of layer.items) {
                shot.setPosition(shot.x + shot.dx * apsk, shot.y + shot.dy * apsk)
                shot.dy = shot.dy + apsk * gravity
                if(shot.fadingSpeed !== undefined) {
                    shot.opacity -= shot.fadingSpeed * apsk
                    if(shot.opacity < 0) shot.opacity = 0
                }
                if (shot.dy > dyThreshold && layer.isShot) {
                    project.scene.remove(layer)
                    let quantity = particlesQuantity.toNumber()
                    for (let i = 0; i < quantity; i++) {
                        let size = particleSize.toNumber()
                        let particle = new Sprite(image, shot.x, shot.y, size, size)
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