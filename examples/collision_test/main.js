import {mouse} from "../../system.js"
import Sprite from "../../sprite.js"
import {project} from "../../project.js"
import {ShapeType} from "../../shape_type.js"
import Shape from "../../shape.js"
import Key from "../../key.js"

project.locales.en = {
}

project.locales.ru = {
}

project.key = {
    switchType: new Key("switchType", "Space")
}

project.getAssets = () => {
    return {
        texture: {
        },
        sound: {
        }
    }
}

project.init = (texture) => {
    let defaultColor = "rgb(0, 128, 0)"
    let collisionColor = "rgb(128, 255, 128)"
    let mouseColor = "rgba(255, 255, 0, 128)"

    let circle = new Sprite(new Shape(defaultColor), 0, -2, 2, 2, ShapeType.circle)
    let box = new Sprite(new Shape(defaultColor), 0, 2, 2, 2, ShapeType.box)

    let mouseShape = new Sprite(new Shape(mouseColor), 0, 0, 1.5, 1.5, ShapeType.circle)
    mouseShape.opacity = 0.5

    let shapeNumber = 0
    let shapes = [ShapeType.circle, ShapeType.box]

    project.scene = [
        circle,
        box,
        mouseShape,
    ]

    project.actions = [
    ]

    project.update = () => {
        mouseShape.setPositionAs(mouse)
        circle.image.color = mouseShape.collidesWithSprite(circle) ? collisionColor : defaultColor
        box.image.color = mouseShape.collidesWithSprite(box) ? collisionColor : defaultColor
        if(project.key.switchType.wasPressed) {
            shapeNumber = (shapeNumber + 1) % shapes.length
            mouseShape.shapeType = shapes[shapeNumber]
        }
    }
}