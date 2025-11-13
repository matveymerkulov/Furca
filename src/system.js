import {initData, project} from "./project.js"
import {Function} from "./function/function.js"
import {keys} from "./key.js"
import {initInput} from "./input.js"
import {Container} from "./container.js"

// global variables

export let fps = 60, aps = 200, paused = false
export let mouse, screenMouse, canvasMouse, apsk = 1 / aps, unc = 0.0000001
export let app, stage, canvasUnderCursor

// enums

export let Align = {
    left: 0,
    top: 0,
    center: 1,
    right: 2,
    bottom: 2
}

// other

export function num(value) {
    if(value === undefined) return undefined
    return typeof value === "number" ? value : value.toNumber()
}

export function togglePause() {
    paused = !paused
}

export function element(name) {
    return document.getElementById(name)
}

// sound

export let masterVolume = 0.25

export function playSound(sound) {
    if(sound === undefined) return
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    newSound.play()
    return newSound
}

export function stopSound(sound) {
    if(sound === undefined) return
    sound.currentTime = 0
    sound.pause()
}

export function muteSound(sound) {
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    return newSound
}

export function loopedSound(sound, loopStart = 0, loopEnd, play = true, volume = masterVolume) {
    let newSound = new Audio(sound.src)
    if(loopStart === 0 && loopEnd === undefined) {
        newSound.loop = true
    } else {
        let loopLength = loopEnd - loopStart
        setInterval(function() {
            if(newSound.currentTime > loopEnd) newSound.currentTime -= loopLength
        }, 5)
    }

    if(play) {
       newSound.play()
    }
    newSound.volume = volume
    return newSound
}

// localization

export class Loc extends Function {
    constructor(name) {
        super()
        this.name = name
    }

    toString() {
        return project.locales[project.locale][this.name]
    }
}

export function loc(stringName) {
    return new Loc(stringName)
}

// main

export function getViewport() {
    const corner1 = stage.toLocal(new PIXI.Point(0, 0))
    const corner2 = stage.toLocal(new PIXI.Point(app.canvas.width, app.canvas.height))
    const width = corner2.x - corner1.x
    const height = corner2.y - corner1.y
    return new PIXI.Rectangle(corner1.x + 0.5 * width, corner1.y + 0.5 * height, width, height)
}

export async function initApp() {
    app = new PIXI.Application();
    await app.init({background: '#1099bb', resizeTo: window})
    document.body.appendChild(app.canvas)
    app.stage.origin.set(app.screen.width / 2, app.screen.height / 2)
    stage = new Container()
    stage.scale = 1.0 / 64
    app.stage.addChild(stage)
}

export function initSystem() {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.substring(0, 2)
    if(project.locales[locale] !== undefined) {
        project.locale = locale
    }

    mouse = new PIXI.Point()
    screenMouse = new PIXI.Point()
    canvasMouse = new PIXI.Point()

    app.canvas.addEventListener("mouseover", () => {
        canvasUnderCursor = this
    })
    app.canvas.addEventListener("mouseout", () => {
        canvasUnderCursor = undefined
    })

    initInput()
    initData()

    project.init()

    document.onmousemove = (event) => {
        screenMouse.set(event.clientX, event.clientY)
        mouse = app.stage.toLocal(screenMouse)
    }

    let apsTime = 0, realAps = 0, apsCounter = 0
    setInterval(function () {
        project.updateNode()

        keys.forEach(key => {
            key.reset()
        })

        let time = new Date().getTime()
        if (time >= apsTime) {
            realAps = apsCounter
            apsTime = time + 1000
            apsCounter = 0
        } else {
            apsCounter++
        }
    }, 1000 / aps)

    let fpsTime = 0, realFps = 0, fpsCounter = 0
    setInterval(function () {
        let time = new Date().getTime()
        if (time >= fpsTime) {
            realFps = fpsCounter
            fpsTime = time + 1000
            fpsCounter = 0
        } else {
            fpsCounter++
        }

        project.render()

        //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
    }, 1000.0 / 150)
}