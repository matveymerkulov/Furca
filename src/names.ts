import {isDigit} from "./parser.js"
import {Shape} from "./shape.js";

let objectName: Map<Shape, string> = new Map()

export function getName(object: Shape) {
    return objectName.get(object)
}

export function setName(object: Shape, name: string) {
    objectName.set(object, name)
}

export function incrementName(name: string) {
    let num = ""
    while(name !== "") {
        let char = name.charAt(name.length - 1)
        if(!isDigit(char) || char === "-") break
        num = char + num
        name = name.substring(0, name.length - 1)
    }
    if(num === "") return name + "2"
    return name + (parseInt(num) + 1)
}