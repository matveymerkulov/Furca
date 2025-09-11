import {defaultCanvas, mouse} from "./system.js"
import {Sprite} from "./sprite.js"
import {project} from "./project.js"
import {ShapeType, VectorShape} from "./vector_shape.js"
import {Key} from "./key.js"

project.init = () => {
    let switchType = new Key("Space", "LMB", "WheelUp", "WheelDown")

    defaultCanvas(40, 22)
    
    let defaultColor = "rgb(0, 128, 0)"
    let collisionColor = "rgb(128, 255, 128)"
    let mouseColor = "rgba(255, 255, 0, 128)"
    let pushedColor = "rgba(255, 255, 0, 128)"

    let circle = new Sprite(new VectorShape(defaultColor), 0, -4, 2, 2, ShapeType.circle)
    let box = new Sprite(new VectorShape(defaultColor), 0, 0, 3, 2, ShapeType.box)
    let pill = new Sprite(new VectorShape(defaultColor), 0, 4, 3, 2, ShapeType.pill)

    let mouseShape = new Sprite(new VectorShape(mouseColor, 0.5), 0, 0, 1.5, 1.5, ShapeType.circle)
    let pushed = new Sprite(new VectorShape(pushedColor), 0, 0, 1.5, 1.5, ShapeType.circle)

    let shapeNumber = 0
    let shapes = [circle, box, pill]
    let shapeTypes = [ShapeType.circle, ShapeType.box, ShapeType.pill]

    project.scene.add(circle, box, pill, pushed, mouseShape)

    project.update = () => {
        mouseShape.setPositionAs(mouse)
        pushed.setPositionAs(mouse)

        for(let shape of shapes) {
            let collision = mouseShape.collidesWithSprite(shape);
            (shape.image as VectorShape).color = collision ? collisionColor : defaultColor
            if(collision) {
                pushed.pushFromSprite(shape)
            }
        }

        if(switchType.keyWasPressed) {
            shapeNumber = (shapeNumber + 1) % shapeTypes.length
            let type = shapeTypes[shapeNumber]
            mouseShape.shapeType = type
            pushed.shapeType = type
            if(type === ShapeType.circle) {
                // noinspection JSSuspiciousNameCombination
                mouseShape.height = pushed.height = mouseShape.width
            } else {
                mouseShape.height = pushed.height = 2.5
            }
        }
    }
}