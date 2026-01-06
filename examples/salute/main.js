import {project} from "../../src/project.js"
import {ShapeType, Sprite} from "../../src/sprite.js"
import {app, apsk, getViewport, initApp, initSystem, setViewport, stage} from "../../src/system.js"
import {Container} from "../../src/container.js"
import {RemoveIfOutside} from "../../src/actions/sprite/remove_if_outside.js"
import {Rnd} from "../../src/function/rnd.js"
import {rad, rnd} from "../../src/functions.js"
import {Box} from "../../src/box.js"

(async () => {
    await initApp()

    const particleTexture = await PIXI.Assets.load("particle.png")

    const shotDX = new Rnd(-1.5, 1.5)
    const shotDY = new Rnd(-13, -15)
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

    project.init = () => {
        setViewport(50)
        let v = getViewport()

        let particles = new Container()
        particles.isShot = false
        stage.addChild(particles)

        /*let draw = function() {
            ctx.globalAlpha = this.opacity
            let x = xToScreen(this.x)
            let y = yToScreen(this.y)
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, distToScreen(this.shapeHalfWidth));
            gradient.addColorStop(0, `rgba(${this.color},255)`)
            gradient.addColorStop(1, `rgba(${this.color},0)`)
            ctx.fillStyle = gradient;
            ctx.fillRect(xToScreen(this.left), yToScreen(this.top), distToScreen(this.shapeWidth), distToScreen(this.shapeHeight));
            ctx.fillStyle = "white"
            ctx.globalAlpha = 1
        }*/

        const viewport = getViewport()
        const remover = new RemoveIfOutside(particles, new Box(
            viewport.x, viewport.y, viewport.width, viewport.height), ShapeType.box)

        project.update = () => {
            stage.applyAction(remover)

            if(rnd(0, 1) < probability) {
                let color = `${particleColor.toNumber()},${particleColor.toNumber()},${particleColor.toNumber()}`
                let shots = new Container()
                shots.isShot = true
                shots.color = color
                stage.addChild(shots)

                let dx = shotDX.toNumber()
                let dy = shotDY.toNumber()
                let x = 5
                let y = 5
                for(let i = 0; i < tailLength; i++) {
                    let shot = new Sprite(particleTexture, x, y)
                    shot.size = shotSize.toNumber() * i / tailLength
                    shot.dx = dx
                    shot.dy = dy
                    shot.color = color
                    x += dx * tailStep
                    y += dy * tailStep
                    dy += tailStep * gravity
                    shots.addChild(shot)
                }
            }

            for(let container of stage.children) {
                for(let shot of container.children) {
                    shot.setShapePosition(shot.x + shot.dx * apsk, shot.y + shot.dy * apsk)
                    shot.dy = shot.dy + apsk * gravity
                    if(shot.fadingSpeed !== undefined) {
                        shot.opacity -= shot.fadingSpeed * apsk
                        if(shot.opacity < 0) shot.opacity = 0
                    }
                    if(shot.dy > dyThreshold && container.isShot) {
                        stage.removeChild(container)
                        let quantity = particlesQuantity.toNumber()
                        for(let i = 0; i < quantity; i++) {
                            let size = particleSize.toNumber()
                            let particle = new Sprite(particleTexture, shot.x, shot.y, size, size)
                            let angle = rnd(rad(360))
                            let length = Math.sqrt(rnd(0, 1)) * particleSpeed.toNumber()
                            particle.dx = length * Math.cos(angle)
                            particle.dy = length * Math.sin(angle)
                            particle.fadingSpeed = fadingSpeed.toNumber()
                            particle.opacity = 1
                            particle.color = container.color
                            particles.addChild(particle)
                        }
                    }
                }
            }
        }
    }

    initSystem()
})()