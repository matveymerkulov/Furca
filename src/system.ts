import {Point} from "./point.js"
import {Canvas, ctx, setCanvas, xFromScreen, yFromScreen} from "./canvas.js"
import {initData, project} from "./project.js"
import {Func} from "./function/func.js"
import {keys} from "./key.js"
import {initInput} from "./input.js"
import {Box} from "./box.js"
import {Sprite} from "./sprite.js"
import {VectorShape} from "./vector_shape.js";

// global variables

export let fps = 60, aps = 200, paused = false
export let mouse: Point, screenMouse: Point, canvasMouse: Point, apsk = 1 / aps, unc = 0.0000001
export const texture = new Map<string, HTMLImageElement>()
export const sound =  new Map<string, HTMLAudioElement>()

// enums

export enum Align {
    left,
    top,
    center,
    right,
    bottom,
}

// other

export function num(value: number | Func) {
    if(value === undefined) return undefined
    return typeof value === "number" ? value : value.toNumber()
}

export function togglePause() {
    paused = !paused
}

export function element(name: string) {
    return document.getElementById(name)
}

// sound

export let masterVolume = 0.25

export function play(name: string) {
    let newSound = new Audio(sound[name].src)
    newSound.volume = masterVolume
    newSound.play()
    return newSound
}

export function playSound(sound: HTMLAudioElement) {
    if(sound === undefined) return
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    newSound.play()
    return newSound
}

export function stopSound(sound: HTMLAudioElement) {
    if(sound === undefined) return
    sound.currentTime = 0
    sound.pause()
}

export function mutedSound(name: string) {
    let newSound = new Audio(sound[name].src)
    newSound.volume = masterVolume
    return newSound
}

export function loopedSound(name: string, loopStart = 0, loopEnd: number, play = true, volume = masterVolume) {
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

export class Loc extends Func {
    constructor(public name: string) {
        super()
    }

    toString() {
        return project.locales[project.locale][this.name]
    }
}

export function loc(stringName: string) {
    return new Loc(stringName)
}

// listeners

export let defaultFontSize: number

export function setFontSize(size: number) {
    ctx.font = size + "px monospace"
}

export function defaultCanvas(width: number, height: number) {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.style.display = "block"
    canvas.focus()

    setCanvas(Canvas.create(canvas, width, height))

    defaultFontSize = canvas.height / 24
    ctx.fillStyle = "white"
    setFontSize(defaultFontSize)
    ctx.textBaseline = "top"
}

document.addEventListener("DOMContentLoaded", function() {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.substring(0, 2)
    if(project.locales[locale] !== undefined) {
        project.locale = locale
    }
    setCanvas(new Canvas(undefined, 0, 0, 1, 1, new Box()))
    mouse = new Point()
    screenMouse = new Point()
    canvasMouse = new Point()
    loadAssets()
})

// assets loader

export function removeExtension(fileName: string) {
    let pos = fileName.lastIndexOf("/")
    if(pos > 0) fileName = fileName.substring(pos + 1)
    return fileName.substring(0, fileName.lastIndexOf("\."))
}

let assetsToLoad = 0
export function loadTexture(textureFileName: string, func) {
    const tex = new Image()
    tex.onload = () => {
        assetsToLoad--
        if(assetsToLoad <= 0) func()
    }
    const key = removeExtension(textureFileName)
    tex.src = project.texturePath + textureFileName
    tex.id = key
    texture[key] = tex
    assetsToLoad++

    return tex
}

export function loadAssets() {
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

    function addAudioListener(audio: HTMLAudioElement) {
        let listener = () => {
            assetsToLoad--
            audio.removeEventListener("canplaythrough", listener, false)
            if (assetsToLoad <= 0) start()
        }
        audio.addEventListener("canplaythrough", listener, false)
    }

    for(const soundFileName of process(project.sounds)) {
        let audio = new Audio()
        addAudioListener(audio)
        let key = removeExtension(soundFileName)
        audio.src = project.soundPath + soundFileName
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
        if(assetsToLoad > 0) return

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
        if(assetsToLoad > 0) return

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

export let collisionShape = new VectorShape("rgb(255, 0, 255)", 0.5)
export let collisionSprite = new Sprite()