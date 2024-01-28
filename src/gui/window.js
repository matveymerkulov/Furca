import {element} from "../system.js"

export let currentWindow

export function showWindow(win) {
    hideWindow()
    if(win instanceof String) {
        currentWindow = element(win)
    } else {
        currentWindow = win
    }
    currentWindow.style.visibility = "visible"
}

export function hideWindow() {
    if(currentWindow !== undefined) currentWindow.style.visibility = "hidden"
    currentWindow = undefined
}