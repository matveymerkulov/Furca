import {element} from "../system.js"

let currentPopup

export function showPopup(name) {
    hidePopup()
    currentPopup = element(name)
    currentPopup.style.visibility = "visible"
}

export function hidePopup() {
    if(currentPopup !== undefined) currentPopup.style.visibility = "hidden"
    currentPopup = undefined
}