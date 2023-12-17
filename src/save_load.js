export function toString(value) {
    if(value instanceof Array) {
        let text = ""
        for(let item of value) {
            text += "," + toString(item)
        }
        return `[${text.substring(1)}]`
    }

    if(value instanceof Object) {
        return value.toString()
    }

    return value
}

export function arrayToString(array) {
    let text = ""
    for(let item of array) {
        text += "," + item
    }
    return `[${text.substring(2)}]`
}

export function save() {
    let text = ""
    text += "export let tileSet = {"
    text += "}"
}