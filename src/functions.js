export function clamp(value, min, max) {
    if(value < min) return min
    if(value > max) return max
    return value
}

export function inBounds(value, min, max) {
    return value >= min && value <= max
}

export function dist(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy)
}

export function dist2(dx, dy) {
    return dx * dx + dy * dy
}

// random

export function rad(angle) {
    return Math.PI * angle / 180
}

export function rndi(from, to = undefined) {
    return Math.floor(rnd(from, to))
}

export function rnd(from = 1, to = undefined) {
    return to === undefined ? Math.random() * from : Math.random() * (to - from) + from
}

export function randomSign() {
    return 2 * rndi(2) - 1
}

// array

export function shuffleArray(array) {
    const quantity = array.quantity
    for(let i = 0; i < quantity - 1; i++) {
        const j = rndi(i + 1, quantity)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

export function removeFromArray(item, array) {
    removeFromArrayByIndex(array.indexOf(item), array)
}

export function removeFromArrayByIndex(index, array) {
    if(index < 0) return
    array.splice(index, 1)
}