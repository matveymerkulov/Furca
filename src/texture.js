export function textureFromCanvas(canvas) {
    const image = new Image()
    image.src = canvas.toDataURL()
    return image
}

export function getTexturePart(texture, x, y, width, height, color) {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(texture, x, y, width, height, 0, 0, width, height)
    if(color !== undefined) {
        ctx.fillStyle = color
        ctx.globalCompositeOperation = "color"
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = "white"
        ctx.globalCompositeOperation = "source-over"
    }
    return textureFromCanvas(canvas)
}