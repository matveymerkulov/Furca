// trigonometry

export let pi = Math.PI

export function sin(angle: number) {
    return Math.sin(angle)
}

export function cos(angle: number) {
    return Math.cos(angle)
}

export function atan2(y: number, x: number) {
    return Math.atan2(y, x)
}

export function sqrt(value: number) {
    return Math.sqrt(value)
}

export function sign(value: number) {
    return Math.sign(value)
}

export function abs(value: number) {
    return Math.abs(value)
}

export function floor(value: number) {
    return Math.floor(value)
}

export function ceil(value: number) {
    return Math.ceil(value)
}

export function min(value1: number, value2: number) {
    return Math.min(value1, value2)
}

export function max(value1: number, value2: number) {
    return Math.max(value1, value2)
}

export function clamp(value: number, min: number, max: number) {
    if(value < min) return min
    if(value > max) return max
    return value
}

export function inBounds(value: number, min: number, max: number) {
    return value >= min && value <= max
}

export function dist(dx: number, dy: number) {
    return sqrt(dx * dx + dy * dy)
}

export function dist2(dx: number, dy: number) {
    return dx * dx + dy * dy
}

// random

export function rad(angle: number) {
    return pi * angle / 180
}

export function rndi(from: number, to: number = undefined) {
    return Math.floor(rnd(from, to))
}

export function rnd(from = 1, to: number = undefined) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * rndi(2) - 1
}

// array

export function shuffleArray(array: any[]) {
    const quantity = array.length
    for(let i = 0; i < quantity - 1; i++) {
        const j = rndi(i + 1, quantity)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

export function removeFromArray(item:any, array: any[]) {
    removeFromArrayByIndex(array.indexOf(item), array)
}

export function removeFromArrayByIndex(index: number, array: any[]) {
    if(index < 0) return
    array.splice(index, 1)
}