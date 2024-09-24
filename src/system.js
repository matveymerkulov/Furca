import {Point} from "./point.js"
import {Canvas, canvasUnderCursor, ctx, setCanvas, xFromScreen, yFromScreen} from "./canvas.js"
import {initData, project} from "./project.js"
import {Function} from "./function/function.js"
import {keys} from "./key.js"
import {initInput} from "./input.js"

// global variables

export let zk = 1.2, fps = 60, aps = 200, paused = false
export let mouse, screenMouse, canvasMouse, apsk = 1 / aps, unc = 0.0000001
export const texture = new Map(), sound = new Map()

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

export function play(name) {
    let newSound = new Audio(sound[name].src)
    newSound.volume = masterVolume
    newSound.play()
    return newSound
}

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

export function mutedSound(name) {
    let newSound = new Audio(sound[name].src)
    newSound.volume = masterVolume
    return newSound
}

export function loopedSound(name, loopStart = 0, loopEnd, play = true, volume = masterVolume) {
    let newSound = new Audio(sound[name].src)
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

// listeners

export let defaultFontSize

export function setFontSize(size) {
    ctx.font = size + "px monospace"
}

export function defaultCanvas(width, height) {
    let canvas = document.getElementById("canvas")
    canvas.style.display = "flex"
    canvas.focus()

    setCanvas(Canvas.create(canvas, width, height))

    defaultFontSize = canvas.height / 24
    ctx.fillStyle = "white"
    setFontSize(defaultFontSize)
    ctx.textBaseline = "top"
}

document.addEventListener("DOMContentLoaded", function() {
    mouse = new Point()
    screenMouse = new Point()
    canvasMouse = new Point()
    loadAssets("", project.getAssets())
})

// assets loader

export function removeExtension(fileName) {
    let pos = fileName.lastIndexOf("/")
    if(pos > 0) fileName = fileName.substring(pos + 1)
    return fileName.substring(0, fileName.lastIndexOf("\."))
}

let assetsToLoad = 0
export function loadAssets(path, asset) {
    function process(assets) {
        const newArray = []
        for(const fileName of assets) {
            const bracketStart = fileName.indexOf("[")
            if(bracketStart < 0) {
                newArray.push(fileName)
                continue
            }
            const minus = fileName.indexOf("-")
            const bracketEnd = fileName.indexOf("]")
            const from = parseInt(fileName.substring(bracketStart + 1, minus))
            const to = parseInt(fileName.substring(minus + 1, bracketEnd))

            for(let index = from; index <= to; index++) {
                newArray.push(fileName.substring(0, bracketStart) + index + fileName.substring(bracketEnd + 1))
            }
        }
        return newArray
    }

    for(const textureFileName of process(asset.texture)) {
        const img = new Image()
        img.onload = () => {
            assetsToLoad--
            if(assetsToLoad <= 0) start()
        }
        const key = removeExtension(textureFileName)
        img.src = path + textureFileName
        img.id = key
        texture[key] = img
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

    for(const soundFileName of process(asset.sound)) {
        let audio = new Audio()
        addAudioListener(audio)
        let key = removeExtension(soundFileName)
        audio.src = path + soundFileName
        sound[key] = audio
        assetsToLoad++
    }

    if(assetsToLoad <= 0) start()
}

function start() {
    initInput()
    initData()

    project.init()

    document.onmousemove = (event) => {
        mouse.setPosition(xFromScreen(event.offsetX), yFromScreen(event.offsetY))
        screenMouse.setPosition(event.clientX, event.clientY)
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

        //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
    }, 1000.0 / 150)
}