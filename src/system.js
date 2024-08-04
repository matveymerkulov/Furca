import Point from "./point.js"
import Canvas, {ctx, setCanvas, xFromScreen, yFromScreen} from "./canvas.js"
import {initData, project} from "./project.js"
import {Function} from "./function/function.js"
import {keys} from "./key.js"
import {initInput} from "./input.js"

// global variables

export let zk = 1.2, fps = 60, aps = 150, paused = false
export let mouse, screenMouse, canvasMouse, apsk = 1 / aps, unc = 0.0000001

// enums

export let align = {
    left: 0,
    top: 0,
    center: 1,
    right: 2,
    bottom: 2
}

// global functions

export function sin(angle) {
    return Math.sin(angle)
}

export function cos(angle) {
    return Math.cos(angle)
}

export function atan2(y, x) {
    return Math.atan2(y, x)
}

export function sqrt(value) {
    return Math.sqrt(value)
}

export function sign(value) {
    return Math.sign(value)
}

export function abs(value) {
    return Math.abs(value)
}

export function floor(value) {
    return Math.floor(value)
}

export function ceil(value) {
    return Math.ceil(value)
}


export function rad(angle) {
    return Math.PI * angle / 180
}

export function rndi(from, to) {
    return Math.floor(rnd(from, to))
}

export function rnd(from = 1, to) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * rndi(2) - 1
}

export function clamp(value, min, max) {
    if(value < min) return min
    if(value > max) return max
    return value
}

export function removeFromArray(item, array) {
    let i = array.indexOf(item)
    if(i < 0) return
    array.splice(i, 1)
}

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

export function play(sound) {
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    try {
        newSound.play().then()
    } catch(e) {

    }
}

export function loopedSound(sound, loopStart, loopEnd, play) {
    let newSound = new Audio(sound.src)
    let loopLength = loopEnd - loopStart
    setInterval(function() {
        if(newSound.currentTime > loopEnd) newSound.currentTime -= loopLength
    }, 5)
    if(play) try {
       newSound.play().then()
    } catch(e) {

    }
    newSound.volume = masterVolume
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

// listeners

let square = true

export function defaultCanvas() {
    let canvas = document.getElementById("canvas")
    if(square) {
        canvas.width = canvas.height = 640
    } else {
        canvas.width = 360
    }
    canvas.style.display = "flex"
    canvas.focus()

    setCanvas(Canvas.create(canvas, square ? 16 : 9, 16))
    ctx.fillStyle = "white"
    ctx.font = canvas.width / 24 + "px monospace"
    ctx.textBaseline = "top"
}

document.addEventListener("DOMContentLoaded", function() {
    mouse = new Point()
    screenMouse = new Point()
    canvasMouse = new Point()
    loadAssets("", project.getAssets())
})

// assets loader

let assetsToLoad = 0
export function loadAssets(path, asset) {
    let textures = {}

    for(const[key, value] of Object.entries(asset.texture)) {
        let texture = new Image()
        texture.onload = () => {
            assetsToLoad--
            if(assetsToLoad <= 0) start()
        }
        texture.src = path + value
        texture.id = key
        textures[key] = texture
        assetsToLoad++
    }

    function addAudioListener(audio) {
        let listener = () => {
            assetsToLoad--
            audio.removeEventListener("canplaythrough", listener, false)
            if (assetsToLoad <= 0) start()
        }
        audio.addEventListener("canplaythrough", listener, false)
    }

    let sounds = {}
    for(const[key, value] of Object.entries(asset.sound)) {
        let audio = new Audio()
        addAudioListener(audio)
        audio.src = path + value
        sounds[key] = audio
        assetsToLoad++
    }

    project._assets = {texture: textures, sound: sounds}
    project.sound = project._assets.sound

    if(assetsToLoad <= 0) start()
}

function start() {
    initInput()
    initData()

    project.init(project._assets.texture)
    delete project._assets

    document.onmousemove = (event) => {
        mouse.setPosition(xFromScreen(event.offsetX), yFromScreen(event.offsetY))
        screenMouse.setPosition(event.clientX, event.clientY)
        canvasMouse.setPosition(event.offsetX, event.offsetY)
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

        project.renderNode()

        ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
    }, 1000.0 / 150)
}