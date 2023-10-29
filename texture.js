export function textureFromCanvas(canvas) {
    let image = new Image()
    image.src = canvas.toDataURL()
    return image
}

export function getTexturePart(texture, x, y, width, height) {
    let canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(texture, x, y, width, height, 0, 0, width, height)
    return textureFromCanvas(canvas)
}