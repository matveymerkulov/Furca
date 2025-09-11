import {Layer} from "../../layer"
import {Action} from "../action"
import {Sprite} from "../../sprite";
import {Func} from "../../function/func";
import {current} from "../../variable/sprite";

export class ExecuteActions extends Action {
    constructor(public object: Sprite) {
        super()
    }

    executeActions(sprite: Sprite) {
        current.sprite = sprite
        for (const command of sprite.actions) {
            command.execute();
        }
    }

    execute() {
        if(this.object instanceof Layer) {
            for (const item of this.object.items) {
                this.executeActions(item);
            }
        } else {
            this.executeActions(this.object.toSprite())
        }
    }
}