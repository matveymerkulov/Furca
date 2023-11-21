import Point from "./point.js"
import Canvas, {ctx, currentCanvas, setCanvas, xFromScreen, yFromScreen} from "./canvas.js"
import {project} from "./project.js"
import {Function} from "./function/function.js"

// global variables

export let zk = 1.2, fps = 60, aps = 150, showCollisionShapes = false, paused = false
export let mouse, apsk = 1 / aps, unc = 0.0000001

// enums

export let align = {
    left: 0,
    top: 0,
    center: 1,
    right: 2,
    bottom: 2
}

// global functions

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

// sound

export let masterVolume = 0.25

export function play(sound) {
    let newSound = new Audio(sound.src)
    newSound.volume = masterVolume
    try {
        newSound.play()
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
       newSound.play()
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

    project.canvas = Canvas.create(canvas, project.scene, square ? 16 : 9, 16)
    setCanvas(project.canvas)
    ctx.fillStyle = "white"
    ctx.font = canvas.width / 24 + "px monospace"
    ctx.textBaseline = "top"
}

document.addEventListener("DOMContentLoaded", function() {
    mouse = new Point()
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
    project.init(project._assets.texture)
    delete project._assets
    if(currentCanvas === undefined) defaultCanvas()

    document.onmousemove = (event) => {
        mouse.moveTo(xFromScreen(event.offsetX), yFromScreen(event.offsetY))
    }

    let apsTime = 0, realAps = 0, apsCounter = 0
    setInterval(function () {
        if(paused) {
            project.update()
        } else {
            project.actions.forEach(action => action.execute())
            project.update()
            project.scene.update()
        }

        for (const key of Object.values(project.key)) {
            if (!(key instanceof Object)) continue
            key._wasPressed = false
        }

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

        project.draw()

        //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
    }, 1000.0 / 150)
}

document.addEventListener("keydown", event => {
    //event.preventDefault();

    switch (event.code) {
        case "KeyL":
            project.locale = project.locale === "ru" ? "en" : "ru"
            break
        case "KeyO":
            showCollisionShapes = !showCollisionShapes
            break
    }

    for(const key of Object.values(project.key)) {
        key.items.forEach(item => {
            if(event.code === item.code) {
                if(!key._isDown) {
                    key._wasPressed = true
                }
                key._isDown = true
            }
        })
    }
}, false)

document.addEventListener("keyup", event => {
    for(const key of Object.values(project.key)) {
        key.items.forEach(item => {
            if(event.code === item.code) {
                key._isDown = false
            }
        })
    }
}, false)

document.addEventListener("mousedown", event => {
    for(const key of Object.values(project.key)) {
        key.items.forEach(item => {
            if(event.button === item.button) {
                if(!key._isDown) {
                    key._wasPressed = true
                }
                key._isDown = false
            }
        })
    }
})

document.addEventListener("mouseup", event => {
    for(const key of Object.values(project.key)) {
        key.items.forEach(item => {
            if(event.code === item.button) {
                key._isDown = false
            }
        })
    }
}, false)

document.addEventListener("wheel", event => {
    let dir = Math.sign(event.deltaY)
    for(const key of Object.values(project.key)) {
        key.items.forEach(item => {
            if(dir === item.dir) {
                key._wasPressed = true
            }
        })
    }
}, false)