import {project} from "../../src/project.js"
import {Img} from "../../src/image.js"
import {apsk, defaultCanvas, texture} from "../../src/system.js"
import {Layer} from "../../src/layer.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../../src/canvas.js"
import {Rnd} from "../../src/function/rnd.js"
import {cos, rad, rnd, sin} from "../../../RuWebQuest 2/src/functions.js"
import {VectorSprite} from "../../src/vector_sprite.js";

import {ShapeType} from "../../src/shape_type"

project.textures = ["particle.png"]

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

//let particle = new Particle(image, shot.x, shot.y, size, size
//    , length * cos(angle), length * sin(angle), fadingSpeed.toNumber(), layer.color)

class Particle extends VectorSprite {
    constructor(image: Img, x: number, y: number, dx: number, dy: number, size: number
                , public fadingSpeed: number, public color: string) {
        super(image, x, y, size, size, ShapeType.circle, dx, dy)
    }

    draw() {
        ctx.globalAlpha = this.opacity
        let x = xToScreen(this.x)
        let y = yToScreen(this.y)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, distToScreen(this.halfWidth));
        gradient.addColorStop(0, `rgba(${this.color},255)`)
        gradient.addColorStop(1, `rgba(${this.color},0)`)
        ctx.fillStyle = gradient;
        ctx.fillRect(xToScreen(this.left), yToScreen(this.top), distToScreen(this.width), distToScreen(this.height));
        ctx.fillStyle = "white"
        ctx.globalAlpha = 1
    }
}

class Particles extends Layer<Particle> {
    isShot = false
    color: string
}

project.init = () => {
    let particleLayers = new Layer<Particles>()

    let particles = new Particles()
    particles.isShot = false

    let image = new Img(texture["particle"], 0, 0)

    defaultCanvas(16, 16)
    currentCanvas.background = "rgb(9, 44, 84)"

    project.scene.add(particleLayers)
    particleLayers.add(particles)

    project.actions = [
        new RemoveIfOutside<Particle>(particles, currentCanvas)
    ]

    project.update = () => {
        if(rnd(0, 1) < probability) {
            let color = `${particleColor.toNumber()},${particleColor.toNumber()},${particleColor.toNumber()}`
            let shots = new Particles()
            shots.isShot = true
            shots.color = color
            particleLayers.add(shots)

            let dx = shotDX.toNumber()
            let dy = shotDY.toNumber()
            let x = 0
            let y = shotY
            for(let i = 0; i < tailLength; i++) {
                let shot = new Particle(image, x, y, dx, dy, shotSize.toNumber() * i / tailLength
                    , fadingSpeed.toNumber(), color)
                x += dx * tailStep
                y += dy * tailStep
                dy += tailStep * gravity
                shots.add(shot)
            }
        }

        for(let layer of particleLayers.items) {
            for (let shot of layer.items) {
                shot.setPosition(shot.x + shot.dx * apsk, shot.y + shot.dy * apsk)
                shot.dy = shot.dy + apsk * gravity
                if(shot.fadingSpeed !== undefined) {
                    shot.opacity -= shot.fadingSpeed * apsk
                    if(shot.opacity < 0) shot.opacity = 0
                }
                if (shot.dy > dyThreshold && layer.isShot) {
                    particleLayers.remove(layer)
                    let quantity = particlesQuantity.toNumber()
                    for (let i = 0; i < quantity; i++) {
                        let size = particleSize.toNumber()
                        let angle = rnd(rad(360))
                        let length = Math.sqrt(rnd(0, 1)) * particleSpeed.toNumber()
                        let particle = new Particle(image, shot.x, shot.y, size
                            , length * cos(angle), length * sin(angle), fadingSpeed.toNumber(), layer.color)
                        particles.add(particle)
                    }
                }
            }
        }
    }
}