import {isDigit} from "../src/parser.js"

let objectName = new Map()

export function getName(object) {
    return objectName.get(object)
}

export function setName(object, name) {
    objectName.set(object, name)
}

export function incrementName(name) {
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