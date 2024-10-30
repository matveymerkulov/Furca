import {element} from "../src/system.js"
import {setKeyBlock} from "../src/input.js"

const enterStringWindow = element("enter_string")
const enterStringCaption = element("string_caption")
const enterStringField = element("string")
const stringOk = element("string_ok")
const stringCancel = element("string_cancel")

export function enterString(caption, defaultValue, okFunc, cancelFunc) {
    setKeyBlock(true)

    enterStringWindow.style.visibility = "visible"
    enterStringField.value = defaultValue
    enterStringCaption.innerText = caption

    stringOk.onclick = () => {
        setKeyBlock(false)
        enterStringWindow.style.visibility = "hidden"
        okFunc(enterStringField.value)
    }

    stringCancel.onclick = () => {
        setKeyBlock(false)
        enterStringWindow.style.visibility = "hidden"
        if(cancelFunc !== undefined) cancelFunc()
    }
}

const confirmWindow = element("confirm")
const confirmCaption = element("confirm_caption")
const confirmYes = element("confirm_yes")
const confirmNo = element("confirm_no")

export function confirm(caption, yesFunc, noFunc) {
    confirmWindow.style.visibility = "visible"
    confirmCaption.innerText = caption
    setKeyBlock(true)

    confirmYes.onclick = () => {
        setKeyBlock(false)
        confirmWindow.style.visibility = "hidden"
        yesFunc()
    }

    confirmNo.onclick = () => {
        setKeyBlock(false)
        confirmWindow.style.visibility = "hidden"
        if(noFunc !== undefined) noFunc()
    }
}