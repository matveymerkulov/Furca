import {project} from "./project.js"
import {keys} from "./key.js"

export let showCollisionShapes = false

export function initInput() {
    document.addEventListener("keydown", event => {
        //event.preventDefault();

        switch(event.code) {
            case "KeyL":
                project.locale = project.locale === "ru" ? "en" : "ru"
                break
            case "KeyO":
                showCollisionShapes = !showCollisionShapes
                break
        }

        keys.forEach(key => {
            key.processKeyDownEvent(event)
        })
    }, false)

    document.addEventListener("keyup", event => {
        keys.forEach(key => {
            key.processKeyUpEvent(event)
        })
    }, false)

    document.addEventListener("mousedown", event => {
        keys.forEach(key => {
            key.processMouseDownEvent(event)
        })
    })

    document.addEventListener("mouseup", event => {
        keys.forEach(key => {
            key.processMouseUpEvent(event)
        })
    }, false)

    document.addEventListener('contextmenu', (event) =>  {
        event.preventDefault();
        return false;
    }, false);

    document.addEventListener("wheel", event => {
        let dir = Math.sign(event.deltaY)
        keys.forEach(key => {
            key.processWheelEvent(dir)
        })
    }, false)
}