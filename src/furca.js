var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
define("src/texture", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textureFromCanvas = textureFromCanvas;
    exports.getTexturePart = getTexturePart;
    function textureFromCanvas(canvas) {
        const image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }
    function getTexturePart(texture, x, y, width, height, color = "") {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(texture, x, y, width, height, 0, 0, width, height);
        if (color !== undefined) {
            ctx.fillStyle = color;
            ctx.globalCompositeOperation = "color";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "white";
            ctx.globalCompositeOperation = "source-over";
        }
        return textureFromCanvas(canvas);
    }
});
define("src/region", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Region = void 0;
    class Region {
        constructor(columns, x = 0, y = 0, width = 0, height = 0) {
            this.columns = columns;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.modify(columns, x, y, width, height);
        }
        modify(columns, x, y, width, height) {
            this.columns = columns;
            this.x = width > 0 ? x : x + width;
            this.y = height > 0 ? y : y + height;
            this.width = Math.abs(width);
            this.height = Math.abs(height);
        }
        process(code) {
            for (let y = 0; y <= this.height; y++) {
                for (let x = 0; x <= this.width; x++) {
                    code(this, x + this.x + (y + this.y) * this.columns);
                }
            }
        }
        collidesWithTile(x, y) {
            return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
        }
    }
    exports.Region = Region;
});
define("src/block", ["require", "exports", "src/region.js"], function (require, exports, region_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Block = exports.BlockType = void 0;
    var BlockType;
    (function (BlockType) {
        BlockType[BlockType["block"] = 0] = "block";
        BlockType[BlockType["frame"] = 1] = "frame";
    })(BlockType || (exports.BlockType = BlockType = {}));
    class Block extends region_js_1.Region {
        constructor(x = 0, y = 0, width = 1, height = 1, type = BlockType.block) {
            super(1, x, y, width, height);
            this.type = type;
        }
        toString() {
            return `new Block(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.type})`;
        }
    }
    exports.Block = Block;
});
// trigonometry
define("src/functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pi = void 0;
    exports.sin = sin;
    exports.cos = cos;
    exports.atan2 = atan2;
    exports.sqrt = sqrt;
    exports.sign = sign;
    exports.abs = abs;
    exports.floor = floor;
    exports.ceil = ceil;
    exports.min = min;
    exports.max = max;
    exports.clamp = clamp;
    exports.inBounds = inBounds;
    exports.dist = dist;
    exports.dist2 = dist2;
    exports.rad = rad;
    exports.rndi = rndi;
    exports.rnd = rnd;
    exports.randomSign = randomSign;
    exports.shuffleArray = shuffleArray;
    exports.removeFromArray = removeFromArray;
    exports.removeFromArrayByIndex = removeFromArrayByIndex;
    exports.pi = Math.PI;
    function sin(angle) {
        return Math.sin(angle);
    }
    function cos(angle) {
        return Math.cos(angle);
    }
    function atan2(y, x) {
        return Math.atan2(y, x);
    }
    function sqrt(value) {
        return Math.sqrt(value);
    }
    function sign(value) {
        return Math.sign(value);
    }
    function abs(value) {
        return Math.abs(value);
    }
    function floor(value) {
        return Math.floor(value);
    }
    function ceil(value) {
        return Math.ceil(value);
    }
    function min(value1, value2) {
        return Math.min(value1, value2);
    }
    function max(value1, value2) {
        return Math.max(value1, value2);
    }
    function clamp(value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
    function inBounds(value, min, max) {
        return value >= min && value <= max;
    }
    function dist(dx, dy) {
        return sqrt(dx * dx + dy * dy);
    }
    function dist2(dx, dy) {
        return dx * dx + dy * dy;
    }
    // random
    function rad(angle) {
        return exports.pi * angle / 180;
    }
    function rndi(from, to = undefined) {
        return Math.floor(rnd(from, to));
    }
    function rnd(from = 1, to = undefined) {
        return to === undefined ? Math.random() * from : Math.random() * (to - from) + from;
    }
    function randomSign() {
        return 2 * rndi(2) - 1;
    }
    // array
    function shuffleArray(array) {
        const quantity = array.length;
        for (let i = 0; i < quantity - 1; i++) {
            const j = rndi(i + 1, quantity);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    function removeFromArray(item, array) {
        removeFromArrayByIndex(array.indexOf(item), array);
    }
    function removeFromArrayByIndex(index, array) {
        if (index < 0)
            return;
        array.splice(index, 1);
    }
});
define("src/vector_shape", ["require", "exports", "src/image.js", "src/canvas", "src/functions"], function (require, exports, image_js_1, canvas_js_1, functions_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorShape = exports.ShapeType = void 0;
    var ShapeType;
    (function (ShapeType) {
        ShapeType[ShapeType["circle"] = 0] = "circle";
        ShapeType[ShapeType["box"] = 1] = "box";
        ShapeType[ShapeType["pill"] = 2] = "pill";
    })(ShapeType || (exports.ShapeType = ShapeType = {}));
    // noinspection JSSuspiciousNameCombination
    class VectorShape extends image_js_1.Img {
        constructor(color, opacity = 1.0, xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
            super(undefined, 0, 0, 0, 0, xMul, yMul, widthMul, heightMul);
            this.color = color;
            this.opacity = opacity;
        }
        drawResized(sx, sy, swidth, sheight, shapeType) {
            let newWidth = swidth * this.widthMul;
            let newHeight = sheight * this.heightMul;
            let newX = -newWidth * this.xMul;
            let newY = -newHeight * this.yMul;
            let halfWidth = 0.5 * swidth;
            let halfHeight = 0.5 * sheight;
            let oldStyle = canvas_js_1.ctx.fillStyle;
            canvas_js_1.ctx.fillStyle = this.color;
            canvas_js_1.ctx.save();
            canvas_js_1.ctx.translate(sx, sy);
            canvas_js_1.ctx.globalAlpha = this.opacity;
            switch (shapeType) {
                case ShapeType.circle:
                    canvas_js_1.ctx.beginPath();
                    canvas_js_1.ctx.arc(halfWidth, halfHeight, halfWidth, 0, (0, functions_js_1.rad)(360));
                    canvas_js_1.ctx.fill();
                    break;
                case ShapeType.box:
                    canvas_js_1.ctx.fillRect(0, 0, swidth, sheight);
                    break;
                case ShapeType.pill:
                    canvas_js_1.ctx.beginPath();
                    if (swidth > sheight) {
                        canvas_js_1.ctx.arc(halfHeight, halfHeight, halfHeight, (0, functions_js_1.rad)(90), (0, functions_js_1.rad)(270));
                        canvas_js_1.ctx.arc(swidth - halfHeight, halfHeight, halfHeight, (0, functions_js_1.rad)(-90), (0, functions_js_1.rad)(90));
                    }
                    else {
                        canvas_js_1.ctx.arc(halfWidth, halfWidth, halfWidth, (0, functions_js_1.rad)(180), (0, functions_js_1.rad)(0));
                        canvas_js_1.ctx.arc(halfWidth, sheight - halfWidth, halfWidth, (0, functions_js_1.rad)(360), (0, functions_js_1.rad)(180));
                    }
                    canvas_js_1.ctx.fill();
                    break;
            }
            canvas_js_1.ctx.fillStyle = oldStyle;
            canvas_js_1.ctx.globalAlpha = 1.0;
            canvas_js_1.ctx.restore();
        }
        drawRotated(sx, sy, swidth, sheight, shapeType) {
            this.drawResized(sx - 0.5 * swidth, sy - 0.5 * sheight, swidth, sheight, shapeType);
        }
    }
    exports.VectorShape = VectorShape;
});
define("src/function/func", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Func = void 0;
    class Func {
        toNumber() {
            return 0;
        }
        calculate(x) {
            return this.toNumber();
        }
        toSprite() {
            return null;
        }
    }
    exports.Func = Func;
});
define("src/key", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Key = exports.keys = void 0;
    exports.keys = [];
    class KeyItem {
        constructor() {
            this.button = -1;
            this.dir = 0;
            this.code = "";
        }
    }
    class Key {
        constructor(...codes) {
            this.keyIsDown = false;
            this.keyWasPressed = false;
            this.items = new Array;
            codes.forEach(code => {
                let item = new KeyItem;
                switch (code) {
                    case "LMB":
                        item.button = 0;
                        break;
                    case "MMB":
                        item.button = 1;
                        break;
                    case "RMB":
                        item.button = 2;
                        break;
                    case "WheelUp":
                        item.dir = -1;
                        break;
                    case "WheelDown":
                        item.dir = 1;
                        break;
                    default:
                        item.code = code;
                }
                this.items.push(item);
            });
            exports.keys.push(this);
        }
        processKeyDownEvent(event) {
            this.items.forEach(item => {
                if (event.code === item.code) {
                    if (!this.keyIsDown) {
                        this.keyWasPressed = true;
                    }
                    this.keyIsDown = true;
                }
            });
        }
        processKeyUpEvent(event) {
            this.items.forEach(item => {
                if (event.code === item.code) {
                    this.keyIsDown = false;
                }
            });
        }
        processMouseDownEvent(event) {
            this.items.forEach(item => {
                if (event.button === item.button) {
                    if (!this.keyIsDown) {
                        this.keyWasPressed = true;
                    }
                    this.keyIsDown = true;
                }
            });
        }
        processMouseUpEvent(event) {
            this.items.forEach(item => {
                if (event.button === item.button) {
                    this.keyIsDown = false;
                }
            });
        }
        processWheelEvent(dir) {
            this.items.forEach(item => {
                if (dir === item.dir) {
                    this.keyWasPressed = true;
                }
            });
        }
        get isDown() {
            return this.keyIsDown;
        }
        get wasPressed() {
            return this.keyWasPressed;
        }
        reset() {
            this.keyWasPressed = false;
        }
    }
    exports.Key = Key;
});
define("src/input", ["require", "exports", "src/project.js", "src/key", "src/functions"], function (require, exports, project_js_1, key_js_1, functions_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.keyBlock = exports.showCollisionShapes = void 0;
    exports.setKeyBlock = setKeyBlock;
    exports.initInput = initInput;
    exports.showCollisionShapes = false;
    exports.keyBlock = false;
    function setKeyBlock(value) {
        exports.keyBlock = value;
    }
    function initInput() {
        document.addEventListener("keydown", event => {
            if (exports.keyBlock)
                return;
            //event.preventDefault();
            switch (event.code) {
                case "KeyL":
                    project_js_1.project.locale = project_js_1.project.locale === "ru" ? "en" : "ru";
                    break;
                case "KeyO":
                    exports.showCollisionShapes = !exports.showCollisionShapes;
                    break;
            }
            for (const key of key_js_1.keys) {
                key.processKeyDownEvent(event);
            }
        }, false);
        document.addEventListener("keyup", event => {
            if (exports.keyBlock)
                return;
            key_js_1.keys.forEach(key => {
                key.processKeyUpEvent(event);
            });
        }, false);
        document.addEventListener("mousedown", event => {
            key_js_1.keys.forEach(key => {
                key.processMouseDownEvent(event);
            });
        });
        document.addEventListener("mouseup", event => {
            key_js_1.keys.forEach(key => {
                key.processMouseUpEvent(event);
            });
        }, false);
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            return false;
        }, false);
        document.addEventListener("wheel", event => {
            let dir = (0, functions_js_2.sign)(event.deltaY);
            key_js_1.keys.forEach(key => {
                key.processWheelEvent(dir);
            });
        }, false);
    }
});
define("src/system", ["require", "exports", "src/point.js", "src/canvas", "src/project", "src/function/func", "src/key", "src/input", "src/box", "src/sprite", "src/vector_shape"], function (require, exports, point_js_1, canvas_js_2, project_js_2, func_js_1, key_js_2, input_js_1, box_js_1, sprite_js_1, vector_shape_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.collisionSprite = exports.collisionShape = exports.defaultFontSize = exports.Loc = exports.masterVolume = exports.Align = exports.sound = exports.texture = exports.unc = exports.apsk = exports.canvasMouse = exports.screenMouse = exports.mouse = exports.paused = exports.aps = exports.fps = void 0;
    exports.num = num;
    exports.togglePause = togglePause;
    exports.element = element;
    exports.play = play;
    exports.playSound = playSound;
    exports.stopSound = stopSound;
    exports.mutedSound = mutedSound;
    exports.loopedSound = loopedSound;
    exports.loc = loc;
    exports.setFontSize = setFontSize;
    exports.defaultCanvas = defaultCanvas;
    exports.removeExtension = removeExtension;
    exports.loadTexture = loadTexture;
    exports.loadAssets = loadAssets;
    // global variables
    exports.fps = 60, exports.aps = 200, exports.paused = false;
    exports.apsk = 1 / exports.aps, exports.unc = 0.0000001;
    exports.texture = new Map();
    exports.sound = new Map();
    // enums
    var Align;
    (function (Align) {
        Align[Align["left"] = 0] = "left";
        Align[Align["top"] = 1] = "top";
        Align[Align["center"] = 2] = "center";
        Align[Align["right"] = 3] = "right";
        Align[Align["bottom"] = 4] = "bottom";
    })(Align || (exports.Align = Align = {}));
    // other
    function num(value) {
        if (value === undefined)
            return undefined;
        return typeof value === "number" ? value : value.toNumber();
    }
    function togglePause() {
        exports.paused = !exports.paused;
    }
    function element(name) {
        return document.getElementById(name);
    }
    // sound
    exports.masterVolume = 0.25;
    function play(name) {
        let newSound = new Audio(exports.sound[name].src);
        newSound.volume = exports.masterVolume;
        newSound.play();
        return newSound;
    }
    function playSound(sound) {
        if (sound === undefined)
            return;
        let newSound = new Audio(sound.src);
        newSound.volume = exports.masterVolume;
        newSound.play();
        return newSound;
    }
    function stopSound(sound) {
        if (sound === undefined)
            return;
        sound.currentTime = 0;
        sound.pause();
    }
    function mutedSound(name) {
        let newSound = new Audio(exports.sound[name].src);
        newSound.volume = exports.masterVolume;
        return newSound;
    }
    function loopedSound(name, loopStart = 0, loopEnd, play = true, volume = exports.masterVolume) {
        let newSound = new Audio(exports.sound[name].src);
        if (loopStart === 0 && loopEnd === undefined) {
            newSound.loop = true;
        }
        else {
            let loopLength = loopEnd - loopStart;
            setInterval(function () {
                if (newSound.currentTime > loopEnd)
                    newSound.currentTime -= loopLength;
            }, 5);
        }
        if (play) {
            newSound.play();
        }
        newSound.volume = volume;
        return newSound;
    }
    // localization
    class Loc extends func_js_1.Func {
        constructor(name) {
            super();
            this.name = name;
        }
        toString() {
            return project_js_2.project.locales[project_js_2.project.locale][this.name];
        }
    }
    exports.Loc = Loc;
    function loc(stringName) {
        return new Loc(stringName);
    }
    function setFontSize(size) {
        canvas_js_2.ctx.font = size + "px monospace";
    }
    function defaultCanvas(width, height) {
        let canvas = document.getElementById("canvas");
        canvas.style.display = "block";
        canvas.focus();
        (0, canvas_js_2.setCanvas)(canvas_js_2.Canvas.create(canvas, width, height));
        exports.defaultFontSize = canvas.height / 24;
        canvas_js_2.ctx.fillStyle = "white";
        setFontSize(exports.defaultFontSize);
        canvas_js_2.ctx.textBaseline = "top";
    }
    document.addEventListener("DOMContentLoaded", function () {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale.substring(0, 2);
        if (project_js_2.project.locales[locale] !== undefined) {
            project_js_2.project.locale = locale;
        }
        (0, canvas_js_2.setCanvas)(new canvas_js_2.Canvas(undefined, 0, 0, 1, 1, new box_js_1.Box()));
        exports.mouse = new point_js_1.Point();
        exports.screenMouse = new point_js_1.Point();
        exports.canvasMouse = new point_js_1.Point();
        loadAssets();
    });
    // assets loader
    function removeExtension(fileName) {
        let pos = fileName.lastIndexOf("/");
        if (pos > 0)
            fileName = fileName.substring(pos + 1);
        return fileName.substring(0, fileName.lastIndexOf("\."));
    }
    let assetsToLoad = 0;
    function loadTexture(textureFileName, func) {
        const tex = new Image();
        tex.onload = () => {
            assetsToLoad--;
            if (assetsToLoad <= 0)
                func();
        };
        const key = removeExtension(textureFileName);
        tex.src = project_js_2.project.texturePath + textureFileName;
        tex.id = key;
        exports.texture[key] = tex;
        assetsToLoad++;
        return tex;
    }
    function loadAssets() {
        function process(assets) {
            const newArray = [];
            for (const fileName of assets) {
                const bracketStart = fileName.indexOf("[");
                if (bracketStart < 0) {
                    newArray.push(fileName);
                    continue;
                }
                const minus = fileName.indexOf("-");
                const bracketEnd = fileName.indexOf("]");
                const from = parseInt(fileName.substring(bracketStart + 1, minus));
                const to = parseInt(fileName.substring(minus + 1, bracketEnd));
                for (let index = from; index <= to; index++) {
                    newArray.push(fileName.substring(0, bracketStart) + index + fileName.substring(bracketEnd + 1));
                }
            }
            return newArray;
        }
        function addAudioListener(audio) {
            let listener = () => {
                assetsToLoad--;
                audio.removeEventListener("canplaythrough", listener, false);
                if (assetsToLoad <= 0)
                    start();
            };
            audio.addEventListener("canplaythrough", listener, false);
        }
        for (const soundFileName of process(project_js_2.project.sounds)) {
            let audio = new Audio();
            addAudioListener(audio);
            let key = removeExtension(soundFileName);
            audio.src = project_js_2.project.soundPath + soundFileName;
            exports.sound[key] = audio;
            assetsToLoad++;
        }
        if (assetsToLoad <= 0)
            start();
    }
    function start() {
        (0, input_js_1.initInput)();
        (0, project_js_2.initData)();
        project_js_2.project.init();
        document.onmousemove = (event) => {
            exports.mouse.setPosition((0, canvas_js_2.xFromScreen)(event.offsetX), (0, canvas_js_2.yFromScreen)(event.offsetY));
            exports.screenMouse.setPosition(event.clientX, event.clientY);
        };
        let apsTime = 0, realAps = 0, apsCounter = 0;
        setInterval(function () {
            if (assetsToLoad > 0)
                return;
            project_js_2.project.updateNode();
            key_js_2.keys.forEach(key => {
                key.reset();
            });
            let time = new Date().getTime();
            if (time >= apsTime) {
                realAps = apsCounter;
                apsTime = time + 1000;
                apsCounter = 0;
            }
            else {
                apsCounter++;
            }
        }, 1000 / exports.aps);
        let fpsTime = 0, realFps = 0, fpsCounter = 0;
        setInterval(function () {
            if (assetsToLoad > 0)
                return;
            let time = new Date().getTime();
            if (time >= fpsTime) {
                realFps = fpsCounter;
                fpsTime = time + 1000;
                fpsCounter = 0;
            }
            else {
                fpsCounter++;
            }
            project_js_2.project.renderNode();
            //ctx.fillText(`fps: ${realFps}, aps: ${realAps}`, 5, 5)
        }, 1000.0 / 150);
    }
    exports.collisionShape = new vector_shape_js_1.VectorShape("rgb(255, 0, 255)", 0.5);
    exports.collisionSprite = new sprite_js_1.Sprite();
});
define("src/collisions", ["require", "exports", "src/box.js", "src/functions"], function (require, exports, box_js_2, functions_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toCircle = toCircle;
    exports.circleWithParamPointCollision = circleWithParamPointCollision;
    exports.pointWithParamBoxCollision = pointWithParamBoxCollision;
    exports.pointWithCircleCollision = pointWithCircleCollision;
    exports.pointWithBoxCollision = pointWithBoxCollision;
    exports.pointWithPillCollision = pointWithPillCollision;
    exports.circleWithCircleCollision = circleWithCircleCollision;
    exports.circleWithBoxCollision = circleWithBoxCollision;
    exports.circleWithPillCollision = circleWithPillCollision;
    exports.boxWithBoxCollision = boxWithBoxCollision;
    exports.boxWithPillCollision = boxWithPillCollision;
    exports.pillWithPillCollision = pillWithPillCollision;
    function toCircle(pill, point, servicePill) {
        if (pill.halfWidth === pill.halfHeight)
            return pill;
        if (pill.halfWidth > pill.halfHeight) {
            let dWidth = pill.halfWidth - pill.halfHeight;
            servicePill.setPosition((0, functions_js_3.clamp)(point.x, pill.x - dWidth, pill.x + dWidth), pill.y);
            servicePill.size = pill.height;
        }
        else {
            let dHeight = pill.halfHeight - pill.halfWidth;
            servicePill.setPosition(pill.x, (0, functions_js_3.clamp)(point.y, pill.y - dHeight, pill.y + dHeight));
            servicePill.size = pill.width;
        }
        return servicePill;
    }
    function circleWithParamPointCollision(circle, x, y) {
        let dx = circle.x - x;
        let dy = circle.y - y;
        return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth;
    }
    function pointWithParamBoxCollision(point, x, y, width, height) {
        return point.x >= x && point.x < x + width && point.y >= y && point.y < y + height;
    }
    function pointWithCircleCollision(point, circle) {
        let dx = circle.x - point.x;
        let dy = circle.y - point.y;
        return dx * dx + dy * dy < circle.halfWidth * circle.halfWidth;
    }
    function pointWithBoxCollision(point, box) {
        return point.x >= box.left && point.x < box.right && point.y >= box.top && point.y < box.bottom;
    }
    function pointWithPillCollision(point, pill) {
        return pointWithCircleCollision(point, toCircle(pill, point, box_js_2.serviceSprite1));
    }
    function circleWithCircleCollision(circle1, circle2) {
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let radius = circle1.halfWidth + circle2.halfWidth;
        return dx * dx + dy * dy < radius * radius;
    }
    function circleWithBoxCollision(circle, box) {
        if (!boxWithBoxCollision(circle, box))
            return false;
        if (circle.x >= box.left && circle.x < box.right)
            return true;
        if (circle.y >= box.top && circle.y < box.bottom)
            return true;
        let x = circle.x < box.x ? box.left : box.right;
        let y = circle.y < box.y ? box.top : box.bottom;
        return circleWithParamPointCollision(circle, x, y);
    }
    function circleWithPillCollision(circle, pill) {
        if (!boxWithBoxCollision(pill, circle))
            return false;
        return circleWithCircleCollision(toCircle(pill, circle, box_js_2.serviceSprite1), circle);
    }
    function boxWithBoxCollision(box1, box2) {
        return Math.abs(box1.x - box2.x) <= box1.halfWidth + box2.halfWidth
            && Math.abs(box1.y - box2.y) <= box1.halfHeight + box2.halfHeight;
    }
    function boxWithPillCollision(box, pill) {
        if (!boxWithBoxCollision(pill, box))
            return false;
        return circleWithBoxCollision(toCircle(pill, box, box_js_2.serviceSprite1), box);
    }
    //    return point.x >= box.left && point.x < box.right && point.y >= box.top && point.y < box.y.bottom
    //If ( Rectangle.X - Rectangle.Width * 0.5 <= Oval.X And Oval.X <= Rectangle.X + Rectangle.Width * 0.5 )
    // Or ( Rectangle.Y - Rectangle.Height * 0.5 <= Oval.Y And Oval.Y <= Rectangle.Y + Rectangle.Height * 0.5 ) Then
    function pillWithPillCollision(pill1, pill2) {
        if (!boxWithBoxCollision(pill1, pill2))
            return false;
        return circleWithCircleCollision(toCircle(pill1, pill2, box_js_2.serviceSprite1), toCircle(pill2, pill1, box_js_2.serviceSprite2));
    }
});
define("src/physics", ["require", "exports", "src/system.js", "src/collisions", "src/box"], function (require, exports, system_js_1, collisions_js_1, box_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector = void 0;
    exports.circleFromCircleVector = circleFromCircleVector;
    exports.circleFromBoxVector = circleFromBoxVector;
    exports.circleFromPillVector = circleFromPillVector;
    exports.boxFromBoxVector = boxFromBoxVector;
    exports.pillFromBoxVector = pillFromBoxVector;
    exports.pillFromPillVector = pillFromPillVector;
    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.x = x;
            this.y = y;
        }
        get angle() {
            return Math.atan2(this.y, this.x);
        }
        multiplyBy(value) {
            this.x *= value;
            this.y *= value;
            return this;
        }
        addToSprite(sprite, k = 1) {
            sprite.setPosition(k * (sprite.x + this.x), k * (sprite.y + this.y));
        }
        subtractFromSprite(sprite, k = 1) {
            sprite.setPosition(k * (sprite.x - this.x), k * (sprite.y - this.y));
        }
        normalize() {
            let length = Math.sqrt(this.x * this.x + this.y * this.y);
            this.x /= length;
            this.y /= length;
            return this;
        }
    }
    exports.Vector = Vector;
    function circleFromCircleVector(circle, fromCircle) {
        let dx = circle.x - fromCircle.x;
        let dy = circle.y - fromCircle.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        let k = (circle.halfWidth + fromCircle.halfWidth + system_js_1.unc) / length;
        return new Vector(fromCircle.x - circle.x + dx * k, fromCircle.y - circle.y + dy * k);
    }
    function circleFromBoxVector(circle, fromBox) {
        if (circle.x >= fromBox.left && circle.x < fromBox.right
            || circle.y >= fromBox.top && circle.y < fromBox.bottom) {
            return boxFromBoxVector(circle, fromBox);
        }
        else {
            box_js_3.serviceSprite1.x = circle.x < fromBox.x ? fromBox.left : fromBox.right;
            box_js_3.serviceSprite1.y = circle.y < fromBox.y ? fromBox.top : fromBox.bottom;
            box_js_3.serviceSprite1.radius = 0;
            return circleFromCircleVector(circle, box_js_3.serviceSprite1);
        }
    }
    function circleFromPillVector(circle, fromPill) {
        let circle2 = (0, collisions_js_1.toCircle)(fromPill, circle, box_js_3.serviceSprite2);
        let k = (circle.halfWidth + circle2.halfWidth) / circle.distanceTo(circle2) - 1.0;
        return new Vector((circle.x - circle2.x) * k, (circle.y - circle2.y) * k);
    }
    function boxFromBoxVector(box, fromBox) {
        let dx = box.x - fromBox.x;
        let dy = box.y - fromBox.y;
        let dwidth = box.halfWidth + fromBox.halfWidth + system_js_1.unc;
        let dheight = box.halfHeight + fromBox.halfHeight + system_js_1.unc;
        if (dwidth - Math.abs(dx) < dheight - Math.abs(dy)) {
            return new Vector(fromBox.x - box.x + Math.sign(dx) * dwidth, 0);
        }
        else {
            return new Vector(0, fromBox.y - box.y + Math.sign(dy) * dheight);
        }
    }
    function pillFromBoxVector(box, fromPill) {
        let dx = fromPill.x - box.x;
        let dy = fromPill.y - box.y;
        let xDistance = Math.abs(dx);
        let yDistance = Math.abs(dy);
        let a = yDistance * box.width >= xDistance * box.height;
        if (fromPill.x > box.left && fromPill.x < box.right && a) {
            return new Vector(0, (box.halfHeight + fromPill.halfHeight - yDistance) * -Math.sign(dy));
        }
        else if (fromPill.y > box.top && fromPill.y < box.bottom && !a) {
            return new Vector((box.halfWidth + fromPill.halfWidth - xDistance) * -Math.sign(dx), 0);
        }
        else {
            box_js_3.serviceSprite1.x = box.x + box.halfWidth * Math.sign(dx);
            box_js_3.serviceSprite1.y = box.y + box.halfHeight * Math.sign(dy);
            (0, collisions_js_1.toCircle)(fromPill, box_js_3.serviceSprite1, box_js_3.serviceSprite2);
            let k = 1.0 - box_js_3.serviceSprite2.halfWidth / box_js_3.serviceSprite2.distanceTo(box_js_3.serviceSprite1);
            return new Vector((box_js_3.serviceSprite2.x - box_js_3.serviceSprite1.x) * k, (box_js_3.serviceSprite2.y - box_js_3.serviceSprite1.y) * k);
        }
    }
    function pillFromPillVector(pill, fromPill) {
        let circle1 = (0, collisions_js_1.toCircle)(pill, fromPill, box_js_3.serviceSprite1);
        let circle2 = (0, collisions_js_1.toCircle)(fromPill, pill, box_js_3.serviceSprite2);
        let k = (circle1.halfWidth + circle2.halfWidth) / circle1.distanceTo(circle2) - 1.0;
        return new Vector((circle1.x - circle2.x) * k, (circle1.y - circle2.y) * k);
    }
});
define("src/actions/action", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Action = void 0;
    class Action {
        execute() {
        }
        copy() {
            return undefined;
        }
    }
    exports.Action = Action;
});
define("src/sprite", ["require", "exports", "src/box.js", "src/canvas", "src/vector_shape", "src/collisions", "src/physics"], function (require, exports, box_js_4, canvas_js_3, vector_shape_js_2, collisions_js_2, physics_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sprite = void 0;
    class Sprite extends box_js_4.Box {
        constructor(image = undefined, x = 0.0, y = 0.0, width = 1.0, height = 1.0, shapeType = vector_shape_js_2.ShapeType.circle, imageAngle = 0, active = true, visible = true) {
            super(x, y, width, height);
            this.image = image;
            this.shapeType = shapeType;
            this.imageAngle = imageAngle;
            this.active = active;
            this.visible = visible;
            this.angle = 0.0;
            this.opacity = 1.0;
            this.flipped = false;
            this.actions = [];
            this.opacity = 1.0;
            this.flipped = false;
        }
        add(...actions) {
            this.actions.push(...actions);
        }
        draw() {
            var _a;
            if (!this.image || !this.visible)
                return;
            canvas_js_3.ctx.globalAlpha = this.opacity;
            this.image.drawRotated((0, canvas_js_3.xToScreen)(this.x), (0, canvas_js_3.yToScreen)(this.y), (0, canvas_js_3.distToScreen)(this.width), (0, canvas_js_3.distToScreen)(this.height), this.shapeType, (_a = this.imageAngle) !== null && _a !== void 0 ? _a : this.angle, this.flipped);
            canvas_js_3.ctx.globalAlpha = 1.0;
        }
        update() {
            for (const action of this.actions) {
                action.execute();
            }
        }
        turnImage(value) {
            this.imageAngle += value;
        }
        hide() {
            this.visible = false;
        }
        show() {
            this.visible = true;
        }
        // collisions
        collidesWithSprite(sprite) {
            switch (this.shapeType) {
                case vector_shape_js_2.ShapeType.circle:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            return (0, collisions_js_2.circleWithCircleCollision)(this, sprite);
                        case vector_shape_js_2.ShapeType.box:
                            return (0, collisions_js_2.circleWithBoxCollision)(this, sprite);
                        case vector_shape_js_2.ShapeType.pill:
                            return (0, collisions_js_2.circleWithPillCollision)(this, sprite);
                    }
                    break;
                case vector_shape_js_2.ShapeType.box:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            return (0, collisions_js_2.circleWithBoxCollision)(sprite, this);
                        case vector_shape_js_2.ShapeType.box:
                            return (0, collisions_js_2.boxWithBoxCollision)(this, sprite);
                        case vector_shape_js_2.ShapeType.pill:
                            return (0, collisions_js_2.boxWithPillCollision)(this, sprite);
                    }
                    break;
                case vector_shape_js_2.ShapeType.pill:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            return (0, collisions_js_2.circleWithPillCollision)(sprite, this);
                        case vector_shape_js_2.ShapeType.box:
                            return (0, collisions_js_2.boxWithPillCollision)(sprite, this);
                        case vector_shape_js_2.ShapeType.pill:
                            return (0, collisions_js_2.pillWithPillCollision)(this, sprite);
                    }
                    break;
            }
            return false;
        }
        pushFromSprite(sprite, k = 1.0) {
            switch (this.shapeType) {
                case vector_shape_js_2.ShapeType.circle:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            (0, physics_js_1.circleFromCircleVector)(this, sprite).addToSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.box:
                            (0, physics_js_1.circleFromBoxVector)(this, sprite).addToSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.pill:
                            (0, physics_js_1.circleFromPillVector)(this, sprite).addToSprite(this, k);
                            break;
                    }
                    break;
                case vector_shape_js_2.ShapeType.box:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            (0, physics_js_1.circleFromBoxVector)(sprite, this).subtractFromSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.box:
                            (0, physics_js_1.boxFromBoxVector)(sprite, this).subtractFromSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.pill:
                            (0, physics_js_1.pillFromBoxVector)(this, sprite).addToSprite(this, k);
                            break;
                    }
                    break;
                case vector_shape_js_2.ShapeType.pill:
                    switch (sprite.shapeType) {
                        case vector_shape_js_2.ShapeType.circle:
                            (0, physics_js_1.circleFromPillVector)(sprite, this).subtractFromSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.box:
                            (0, physics_js_1.pillFromBoxVector)(this, sprite).addToSprite(this, k);
                            break;
                        case vector_shape_js_2.ShapeType.pill:
                            (0, physics_js_1.pillFromPillVector)(this, sprite).addToSprite(this, k);
                            break;
                    }
                    break;
            }
        }
        toSprite() {
            return this;
        }
    }
    exports.Sprite = Sprite;
});
define("src/vector_sprite", ["require", "exports", "src/sprite.js", "src/system", "src/vector_shape"], function (require, exports, sprite_js_2, system_js_2, vector_shape_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VectorSprite = void 0;
    class VectorSprite extends sprite_js_2.Sprite {
        constructor(image, x = 0.0, y = 0.0, width = 1.0, height = 1.0, shapeType = vector_shape_js_3.ShapeType.circle, dx = 0, dy = 0, imageAngle = 0, active = true, visible = true) {
            super(image, x, y, width, height, shapeType, imageAngle, active, visible);
            this.dx = dx;
            this.dy = dy;
        }
        setMovingVector(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }
        move() {
            this.x += this.dx * system_js_2.apsk;
            this.y += this.dy * system_js_2.apsk;
        }
        moveHorizontally() {
            this.x += this.dx * system_js_2.apsk;
        }
        moveVertically() {
            this.y += this.dy * system_js_2.apsk;
        }
    }
    exports.VectorSprite = VectorSprite;
});
define("src/angular_sprite", ["require", "exports", "src/sprite.js", "src/system", "src/vector_shape", "src/functions"], function (require, exports, sprite_js_3, system_js_3, vector_shape_js_4, functions_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AngularSprite = void 0;
    class AngularSprite extends sprite_js_3.Sprite {
        constructor(image, x = 0.0, y = 0.0, width = 1.0, height = 1.0, shapeType = vector_shape_js_4.ShapeType.circle, angle = 0, speed = 0, imageAngle = 0, active = true, visible = true) {
            super(image, x, y, width, height, shapeType, imageAngle, active, visible);
            this.angle = angle;
            this.speed = speed;
            this.angle = angle;
            this.speed = speed;
        }
        move() {
            this.x += (0, functions_js_4.cos)(this.angle) * this.speed * system_js_3.apsk;
            this.y += (0, functions_js_4.sin)(this.angle) * this.speed * system_js_3.apsk;
        }
        moveHorizontally() {
            this.x += (0, functions_js_4.cos)(this.angle) * this.speed * system_js_3.apsk;
        }
        moveVertically() {
            this.y += (0, functions_js_4.sin)(this.angle) * this.speed * system_js_3.apsk;
        }
        setAngleAs(sprite) {
            this.angle = sprite.angle;
        }
        turn(value) {
            this.angle += value;
        }
    }
    exports.AngularSprite = AngularSprite;
});
define("src/tile_map", ["require", "exports", "src/box.js", "src/canvas", "src/save_load", "src/input", "src/project", "src/functions", "src/system", "src/vector_sprite", "src/angular_sprite"], function (require, exports, box_js_5, canvas_js_4, save_load_js_1, input_js_2, project_js_3, functions_js_5, system_js_4, vector_sprite_js_1, angular_sprite_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TileMap = exports.showBorder = exports.emptyTile = void 0;
    exports.setBorderVisibility = setBorderVisibility;
    exports.emptyTile = -1;
    exports.showBorder = false;
    function setBorderVisibility(value) {
        exports.showBorder = value;
    }
    class TileMap extends box_js_5.Box {
        constructor(tileSet, columns, rows, x = 0, y = 0, cellWidth = 1, cellHeight = 1, array = undefined) {
            super(x, y, cellWidth * columns, cellHeight * rows);
            this._tileSet = tileSet;
            this._columns = columns;
            this._rows = rows;
            this._array = array !== null && array !== void 0 ? array : new Array(columns * rows).fill(exports.emptyTile);
            this.cellWidth = cellWidth;
            this.cellHeight = cellHeight;
        }
        copy(dx = 0, dy = 0) {
            return new TileMap(this._tileSet, this._columns, this._rows, this.x + dx, this.y + dy, this.cellWidth, this.cellHeight, [...this._array]);
        }
        toString() {
            return `new TileMap(tileSet.${this._tileSet.name}, ${this._columns}, ${this._rows}, ${this.x}, ${this.y}`
                + `, ${this.cellWidth}, ${this.cellHeight}, ${(0, save_load_js_1.arrayToString)(this._array, this._columns, 3)})`;
        }
        get rows() {
            return this._rows;
        }
        get columns() {
            return this._columns;
        }
        get quantity() {
            return this._array.length;
        }
        get tileSet() {
            return this._tileSet;
        }
        get arrayCopy() {
            return [...this._array];
        }
        get name() {
            for (let [key, map] of Object.entries(project_js_3.tileMap)) {
                if (this === map)
                    return key;
            }
            return undefined;
        }
        image(num) {
            return this._tileSet.image(num);
        }
        tileColumnByPoint(point) {
            return (0, functions_js_5.floor)((point.x - this.left) / this.cellWidth);
        }
        tileRowByPoint(point) {
            return (0, functions_js_5.floor)((point.y - this.top) / this.cellHeight);
        }
        tileColumnByX(x) {
            return (0, functions_js_5.floor)((x - this.left) / this.cellWidth);
        }
        tileRowByY(y) {
            return (0, functions_js_5.floor)((y - this.top) / this.cellHeight);
        }
        tileByIndex(index) {
            return this._array[index];
        }
        tileByCoords(x, y) {
            const column = this.tileColumnByX(x);
            if (column < 0 || column >= this.columns)
                return exports.emptyTile;
            const row = this.tileRowByY(y);
            if (row < 0 || row >= this.rows)
                return exports.emptyTile;
            return this.tileByPos(column, row);
        }
        tileByPoint(point) {
            return this.tileByCoords(point.x, point.y);
        }
        tileIndexForPos(column, row) {
            return column + row * this._columns;
        }
        tileColumnByIndex(index) {
            return index % this._columns;
        }
        tileRowByIndex(index) {
            return Math.floor(index / this._columns);
        }
        tileXByColumn(column) {
            return this.left + this.cellWidth * (0.5 + column);
        }
        tileYByRow(row) {
            return this.top + this.cellHeight * (0.5 + row);
        }
        tileXByIndex(index) {
            return this.left + this.cellWidth * (0.5 + this.tileColumnByIndex(index));
        }
        tileYByIndex(index) {
            return this.top + this.cellHeight * (0.5 + this.tileRowByIndex(index));
        }
        tileByPos(column, row) {
            if (column < 0 || column >= this.columns || row < 0 || row >= this.rows) {
                return exports.emptyTile;
            }
            return this.tileByIndex(this.tileIndexForPos(column, row));
        }
        setTileByIndex(index, tileNum) {
            this._array[index] = tileNum;
        }
        setTileByPos(column, row, tileNum) {
            this.setTileByIndex(this.tileIndexForPos(column, row), tileNum);
        }
        setTileByCoords(x, y, tile) {
            this.setTileByPos(this.tileColumnByX(x), this.tileRowByY(y), tile);
        }
        setArray(array) {
            if (array.length !== this._array.length)
                throw Error("Array size is not equal to tile map size");
            this._array = array;
        }
        clear() {
            this._array.fill(-1);
        }
        draw() {
            const x0 = Math.floor((0, canvas_js_4.xToScreen)(this.left));
            const y0 = Math.floor((0, canvas_js_4.yToScreen)(this.top));
            const tileSet = this.tileSet;
            if (exports.showBorder) {
                canvas_js_4.ctx.strokeStyle = "white";
                canvas_js_4.ctx.strokeRect(x0, y0, (0, canvas_js_4.distToScreen)(this.width), (0, canvas_js_4.distToScreen)((this.height)));
            }
            const width = (0, canvas_js_4.distToScreen)(this.cellWidth);
            const height = (0, canvas_js_4.distToScreen)(this.cellHeight);
            const quantity = this.quantity;
            for (let row = 0; row < this._rows; row++) {
                let intY = Math.floor(y0 + height * row);
                let intHeight = Math.floor(y0 + height * (row + 1)) - intY;
                for (let column = 0; column < this._columns; column++) {
                    const tileNum = this.tileByPos(column, row);
                    if (tileNum < 0 || tileNum >= quantity)
                        continue;
                    const intX = Math.floor(x0 + width * column);
                    const intWidth = Math.floor(x0 + width * (column + 1)) - intX;
                    this.drawTile(tileNum, column, row, intX, intY, intWidth, intHeight);
                    if (!input_js_2.showCollisionShapes)
                        continue;
                    const shape = tileSet.collisionShape(tileNum);
                    if (shape === undefined)
                        continue;
                    system_js_4.collisionShape.drawResized(intX + (0, canvas_js_4.distToScreen)(shape.x - shape.halfWidth), intY + (0, canvas_js_4.distToScreen)(shape.y - shape.halfHeight), width * shape.width, height * shape.height, shape.shapeType);
                }
            }
        }
        drawTile(tileNum, column, row, intX, intY, intWidth, intHeight) {
            this.tileSet.images.image(tileNum).drawResized(intX, intY, intWidth, intHeight);
        }
        countTiles(tile) {
            let quantity = 0;
            for (let index = 0; index < this.quantity; index++) {
                if (tile === this.tileByIndex(index))
                    quantity++;
            }
            return quantity;
        }
        findTileIndex(tile) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile === this.tileByIndex(index))
                    return index;
            }
            throw new Error("Cannot find tile " + tile);
        }
        initTileSpriteByIndex(sprite, index) {
            sprite.image = this.image(this.tileByIndex(index));
            sprite.x = this.tileXByIndex(index);
            sprite.y = this.tileYByIndex(index);
            sprite.width = this.cellWidth;
            sprite.height = this.cellHeight;
            return sprite;
        }
        initTileSpriteByPos(sprite, column, row) {
            this.initTileSpriteByIndex(sprite, this.tileIndexForPos(column, row));
        }
        extractTile(sprite, tile) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                this.initTileSpriteByIndex(sprite, index);
                this.setTileByIndex(index, exports.emptyTile);
                return sprite;
            }
            throw new Error("Cannot find tile " + tile);
        }
        extractTilesByIndex(tile, code) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                let sprite = code(this, index);
                this.initTileSpriteByIndex(sprite, index);
                this.setTileByIndex(index, exports.emptyTile);
            }
        }
        extractTilesByPos(tile, code) {
            for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                    if (tile !== this.tileByPos(column, row))
                        continue;
                    let sprite = code(this, column, row);
                    this.initTileSpriteByPos(sprite, column, row);
                    this.setTileByPos(column, row, exports.emptyTile);
                }
            }
        }
        extractTileByIndex(sprite, index) {
            this.initTileSpriteByIndex(sprite, index);
            this.setTileByIndex(index, exports.emptyTile);
            return sprite;
        }
        extractTileByPos(sprite, column, row) {
            return this.extractTileByIndex(sprite, this.tileIndexForPos(column, row));
        }
        tileAngularSpriteByIndex(shapeType, index) {
            return new angular_sprite_js_1.AngularSprite(this.image(this.tileByIndex(index)), this.tileXByIndex(index), this.tileYByIndex(index), this.cellWidth, this.cellHeight, shapeType);
        }
        tileVectorSpriteByIndex(shapeType, index) {
            return new vector_sprite_js_1.VectorSprite(this.image(this.tileByIndex(index)), this.tileXByIndex(index), this.tileYByIndex(index), this.cellWidth, this.cellHeight, shapeType);
        }
        tileAngularSpriteByPos(shapeType, column, row) {
            return this.tileAngularSpriteByIndex(shapeType, this.tileIndexForPos(column, row));
        }
        tileVectorSpriteByPos(shapeType, column, row) {
            return this.tileVectorSpriteByIndex(shapeType, this.tileIndexForPos(column, row));
        }
        extractAngularTile(tile, shapeType) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                return this.extractAngularTileByIndex(index, shapeType);
            }
            throw new Error("Cannot find tile " + tile);
        }
        extractVectorTile(tile, shapeType) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                return this.extractVectorTileByIndex(index, shapeType);
            }
            throw new Error("Cannot find tile " + tile);
        }
        extractAngularTiles(tile, shapeType, layer) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                layer.add(this.extractAngularTileByIndex(index, shapeType));
            }
        }
        extractVectorTiles(tile, shapeType, layer) {
            for (let index = 0; index < this.quantity; index++) {
                if (tile !== this.tileByIndex(index))
                    continue;
                layer.add(this.extractVectorTileByIndex(index, shapeType));
            }
        }
        extractAngularTileByIndex(index, shapeType) {
            let sprite = this.tileAngularSpriteByIndex(shapeType, index);
            this.setTileByIndex(index, exports.emptyTile);
            return sprite;
        }
        extractVectorTileByIndex(index, shapeType) {
            let sprite = this.tileVectorSpriteByIndex(shapeType, index);
            this.setTileByIndex(index, exports.emptyTile);
            return sprite;
        }
        extractAngularTileByPos(column, row, shapeType) {
            return this.extractAngularTileByIndex(this.tileIndexForPos(column, row), shapeType);
        }
        extractVectorTileByPos(column, row, shapeType) {
            return this.extractVectorTileByIndex(this.tileIndexForPos(column, row), shapeType);
        }
        shiftTiles(d) {
            for (let index = 0; index < this.quantity; index++) {
                if (this._array[index] === exports.emptyTile)
                    continue;
                this._array[index] += d;
            }
        }
        processTilesByPos(code) {
            for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                    code(column, row, this.tileByPos(column, row));
                }
            }
        }
        processTilesByIndex(code) {
            for (let index = 0; index < this._array.length; index++) {
                code(index, this.tileByIndex(index));
            }
        }
        pasteTo(toMap, dColumn = 0, dRow = 0) {
            for (let row = 0; row < this.rows; row++) {
                const mapRow = row + dRow;
                if (mapRow < 0 || mapRow >= toMap.rows)
                    continue;
                for (let column = 0; column < this.columns; column++) {
                    const mapColumn = column + dColumn;
                    if (mapColumn < 0 || mapColumn >= toMap.columns)
                        continue;
                    const tile = this.tileByPos(column, row);
                    if (tile < 0)
                        continue;
                    toMap.setTileByPos(mapColumn, mapRow, tile);
                }
            }
        }
        tileCollisionWithSprite(sprite, code) {
            let tileSet = this._tileSet;
            let x0 = Math.floor((sprite.left - this.left) / this.cellWidth);
            let x1 = Math.ceil((sprite.right - this.left) / this.cellWidth);
            let y0 = Math.floor((sprite.top - this.top) / this.cellHeight);
            let y1 = Math.ceil((sprite.bottom - this.top) / this.cellHeight);
            for (let y = y0; y <= y1; y++) {
                for (let x = x0; x <= x1; x++) {
                    let tileNum = this.tileByPos(x, y);
                    let shape = tileSet.collisionShape(tileNum);
                    if (shape === undefined)
                        continue;
                    system_js_4.collisionSprite.shapeType = shape.shapeType;
                    system_js_4.collisionSprite.setPosition(this.left + (shape.x + x) * this.cellWidth, this.top + (shape.y + y) * this.cellHeight);
                    system_js_4.collisionSprite.setSize(this.cellWidth * shape.width, this.cellHeight * shape.height);
                    if (!sprite.collidesWithSprite(system_js_4.collisionSprite))
                        continue;
                    code(system_js_4.collisionSprite, tileNum, x, y);
                }
            }
        }
        collidesWithTileMap(map, dColumn, dRow) {
            for (let row = 0; row < map.rows; row++) {
                const thisRow = row + dRow;
                if (thisRow < 0 || thisRow >= this.rows)
                    continue;
                for (let column = 0; column < map.columns; column++) {
                    const thisColumn = column + dColumn;
                    if (thisColumn < 0 || thisColumn >= this.columns)
                        continue;
                    if (map.tileByPos(column, row) >= 0 && this.tileByPos(thisColumn, thisRow) >= 0)
                        return true;
                }
            }
            return false;
        }
    }
    exports.TileMap = TileMap;
});
define("src/shape", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shape = void 0;
    class Shape {
        draw() { }
        copy(dx = 0, dy = 0) {
            return undefined;
        }
        update() { }
        remove(object) { }
        drawResized(sx, sy, swidth, sheight, shapeType) { }
        drawRotated(sx, sy, swidth, sheight, shapeType, angle, flipped) { }
        drawDashedRegion(isCircle) { }
        setPositionAs(sprite) { }
        move() { }
        moveHorizontally() { }
        moveVertically() { }
        shift(dx, dy) { }
        wrap(bounds) { }
        setAngleAs(sprite) { }
        turn(value) { }
        turnImage(angle) { }
        processSprites(code) { }
        findTileMapByTileSet(tileSet) {
            return undefined;
        }
        // collisions
        firstCollisionWithPoint(x, y) {
            return undefined;
        }
        collidesWithPoint(x, y) {
            return false;
        }
        collisionWithSprite(sprite, code) {
            for (const item of this.items) {
                item.collisionWithSprite(sprite, code);
            }
        }
        collisionWithTileMap(tileMap, code) {
            for (const item of this.items) {
                item.collisionWithTileMap(tileMap, code);
            }
        }
        collisionWithPoint(x, y, code) {
            this.items.forEach(item => item.collisionWithPoint(x, y, code));
        }
        overlaps(box) {
            return false;
        }
        isInside(box) {
            return false;
        }
    }
    exports.Shape = Shape;
});
define("src/point", ["require", "exports", "src/functions.js", "src/shape"], function (require, exports, functions_js_6, shape_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    class Point extends shape_js_1.Shape {
        constructor(x = 0.0, y = 0.0) {
            super();
            this.x = x;
            this.y = y;
        }
        setPosition(x, y) {
            this.x = x;
            this.y = y;
        }
        setPositionAs(point, dx = 0, dy = 0) {
            this.x = point.x + dx;
            this.y = point.y + dy;
        }
        moveToCircle(x, y, radius) {
            let angle = (0, functions_js_6.rad)((0, functions_js_6.rnd)(360));
            radius = Math.sqrt((0, functions_js_6.rnd)(radius));
            this.x = x + radius * Math.cos(angle);
            this.y = y + radius * Math.sin(angle);
        }
        moveToPerimeter(bounds) {
            let dx = bounds.right - bounds.left;
            let dy = bounds.bottom - bounds.top;
            if ((0, functions_js_6.rnd)(dx + dy) < dx) {
                this.x = (0, functions_js_6.rnd)(bounds.left, bounds.right);
                this.y = (0, functions_js_6.rndi)(2) ? bounds.top : bounds.bottom;
            }
            else {
                this.x = (0, functions_js_6.rndi)(2) ? bounds.left : bounds.right;
                this.y = (0, functions_js_6.rnd)(bounds.top, bounds.bottom);
            }
        }
        wrap(bounds) {
            while (this.x < bounds.left)
                this.x += bounds.width;
            while (this.x >= bounds.right)
                this.x -= bounds.width;
            while (this.y < bounds.top)
                this.y += bounds.height;
            while (this.y >= bounds.bottom)
                this.y -= bounds.height;
        }
        distance2To(point) {
            let dx = this.x - point.x;
            let dy = this.y - point.y;
            return dx * dx + dy * dy;
        }
        distanceTo(point) {
            return (0, functions_js_6.sqrt)(this.distance2To(point));
        }
        angleTo(x, y) {
            return (0, functions_js_6.atan2)(y - this.y, x - this.x);
        }
        angleToPoint(point) {
            return this.angleTo(point.x, point.y);
        }
        processSprites(code) {
            code(this);
        }
        // collisions
        collidesWithPoint(x, y) {
            return x === this.x && y === this.y;
        }
        firstCollisionWithPoint(x, y) {
            return this.collidesWithPoint(x, y) ? this : undefined;
        }
        collisionWithPoint(x, y, code) {
            if (this.collidesWithPoint(x, y))
                code(x, y, this);
        }
        isInside(box) {
            return this.x >= box.left && this.x < box.right && this.y >= box.top && this.y < box.bottom;
        }
    }
    exports.Point = Point;
});
define("editor/draw", ["require", "exports", "src/canvas.js", "src/functions"], function (require, exports, canvas_js_5, functions_js_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drawShape = drawShape;
    exports.drawArrow = drawArrow;
    exports.drawDashedRegion = drawDashedRegion;
    exports.drawLine = drawLine;
    exports.drawRect = drawRect;
    function drawShape(x, y, parameters, type = undefined) {
        if (parameters.hasOwnProperty("outline")) {
            drawShape(x, y, parameters.outline, parameters.type);
        }
        canvas_js_5.ctx.strokeStyle = parameters.color;
        canvas_js_5.ctx.lineWidth = parameters.lineWidth;
        const size = parameters.size;
        canvas_js_5.ctx.beginPath();
        switch (type === undefined ? parameters.type : type) {
            case "x":
                canvas_js_5.ctx.moveTo(x - size, y - size);
                canvas_js_5.ctx.lineTo(x + size, y + size);
                canvas_js_5.ctx.moveTo(x + size, y - size);
                canvas_js_5.ctx.lineTo(x - size, y + size);
                canvas_js_5.ctx.stroke();
                break;
            case "+":
                canvas_js_5.ctx.moveTo(x, y - size);
                canvas_js_5.ctx.lineTo(x, y + size);
                canvas_js_5.ctx.moveTo(x + size, y);
                canvas_js_5.ctx.lineTo(x - size, y);
                canvas_js_5.ctx.stroke();
                break;
            case "o":
                const radius = 0.5 * parameters.size;
                canvas_js_5.ctx.ellipse(x, y, radius, radius, 0, 0, (0, functions_js_7.rad)(360));
                canvas_js_5.ctx.fill();
                break;
            default:
                throw Error("invalid shape type");
        }
        canvas_js_5.ctx.strokeStyle = "white";
    }
    function drawArrow(x1, y1, x2, y2, parameters) {
        const angle = (0, functions_js_7.atan2)(y2 - y1, x2 - x1);
        canvas_js_5.ctx.beginPath();
        canvas_js_5.ctx.lineWidth = parameters.lineWidth;
        canvas_js_5.ctx.strokeStyle = parameters.color;
        canvas_js_5.ctx.moveTo(x1, y1);
        canvas_js_5.ctx.lineTo(x2, y2);
        const length = parameters.pointerLength;
        for (let i = -1; i <= 1; i += 2) {
            const a = angle + i * parameters.angle;
            canvas_js_5.ctx.moveTo(x2, y2);
            canvas_js_5.ctx.lineTo(x2 + length * (0, functions_js_7.cos)(a), y2 + length * (0, functions_js_7.sin)(a));
        }
        canvas_js_5.ctx.stroke();
        canvas_js_5.ctx.strokeStyle = "white";
        canvas_js_5.ctx.lineWidth = 1;
    }
    let dashes = [
        [4, 4],
        [0, 1, 4, 3],
        [0, 2, 4, 2],
        [0, 3, 4, 1],
        [0, 4, 4, 0],
        [1, 4, 3, 0],
        [2, 4, 2, 0],
        [3, 4, 1, 0],
    ];
    function drawDashedRegion(x, y, width, height, isCircle = false) {
        function draw() {
            if (isCircle) {
                canvas_js_5.ctx.beginPath();
                canvas_js_5.ctx.ellipse(x + 0.5 * width, y + 0.5 * height, 0.5 * width, 0.5 * height, 0, 0, 2.0 * Math.PI);
                canvas_js_5.ctx.stroke();
            }
            else {
                canvas_js_5.ctx.strokeRect(x, y, width, height);
            }
        }
        x = Math.floor(x);
        y = Math.floor(y);
        width = Math.floor(width);
        height = Math.floor(height);
        canvas_js_5.ctx.strokeStyle = "black";
        canvas_js_5.ctx.lineWidth = 2;
        draw();
        let shift = Math.floor(new Date().getTime() / 100) % 8;
        canvas_js_5.ctx.setLineDash(dashes[shift]);
        canvas_js_5.ctx.strokeStyle = "white";
        draw();
        canvas_js_5.ctx.setLineDash([]);
        canvas_js_5.ctx.lineWidth = 1;
    }
    function drawLine(x1, y1, x2, y2) {
        canvas_js_5.ctx.strokeStyle = "magenta";
        canvas_js_5.ctx.beginPath();
        canvas_js_5.ctx.moveTo(x1, y1);
        canvas_js_5.ctx.lineTo(x2, y2);
        canvas_js_5.ctx.stroke();
        canvas_js_5.ctx.strokeStyle = "white";
    }
    function drawRect(x, y, width, height, parameters, padding = 0) {
        if (parameters.hasOwnProperty("outline")) {
            drawRect(x, y, width, height, parameters.outline, parameters.padding);
        }
        if (padding === undefined)
            padding = parameters.hasOwnProperty("padding") ? parameters.padding : 0;
        const padding2 = padding * 2.0;
        canvas_js_5.ctx.strokeStyle = parameters.color;
        canvas_js_5.ctx.lineWidth = parameters.lineWidth;
        canvas_js_5.ctx.strokeRect(Math.floor(x + padding + 1), Math.floor(y + padding + 1), Math.floor(width - padding2), Math.floor(height - padding2));
        canvas_js_5.ctx.strokeStyle = "white";
    }
});
define("src/box", ["require", "exports", "src/point.js", "src/system", "src/canvas", "editor/draw"], function (require, exports, point_js_2, system_js_5, canvas_js_6, draw_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serviceSprite2 = exports.serviceSprite1 = exports.Box = void 0;
    class Box extends point_js_2.Point {
        constructor(x = 0.0, y = 0.0, width = 0.0, height = 0.0) {
            super(x, y);
            this.halfWidth = 0.5 * width;
            this.halfHeight = 0.5 * height;
        }
        static fromArea(left, top, width, height) {
            return new Box(left + 0.5 * width, top + 0.5 * height, width, height);
        }
        get size() {
            return this.halfWidth * 2.0;
        }
        set size(value) {
            this.halfWidth = this.halfHeight = value * 0.5;
        }
        get radius() {
            return this.halfWidth;
        }
        set radius(value) {
            this.halfWidth = this.halfHeight = value;
        }
        get width() {
            return this.halfWidth * 2.0;
        }
        set width(value) {
            this.halfWidth = value * 0.5;
        }
        get height() {
            return this.halfHeight * 2.0;
        }
        set height(value) {
            this.halfHeight = value * 0.5;
        }
        get left() {
            return this.x - this.halfWidth;
        }
        set left(value) {
            this.x = value + this.halfWidth;
        }
        get top() {
            return this.y - this.halfHeight;
        }
        set top(value) {
            this.y = value + this.halfHeight;
        }
        get right() {
            return this.x + this.halfWidth;
        }
        set right(value) {
            this.x = value - this.halfWidth;
        }
        get bottom() {
            return this.y + this.halfHeight;
        }
        set bottom(value) {
            this.y = value - this.halfHeight;
        }
        setCorner(x, y) {
            this.left = x;
            this.top = y;
        }
        setSize(width, height) {
            this.width = width;
            this.height = height;
        }
        alterSize(dWidth, dHeight) {
            this.width += dWidth;
            this.height += dHeight;
        }
        setSizeAs(shape) {
            this.width = shape.width;
            this.height = shape.height;
        }
        drawDashedRegion(isCircle = false) {
            (0, draw_js_1.drawDashedRegion)((0, canvas_js_6.xToScreen)(this.left), (0, canvas_js_6.yToScreen)(this.top), (0, canvas_js_6.distToScreen)(this.width), (0, canvas_js_6.distToScreen)(this.height), isCircle);
        }
        limit(box) {
            if (this.left < box.left)
                this.left = box.left + system_js_5.unc;
            if (this.right > box.right)
                this.right = box.right - system_js_5.unc;
            if (this.top < box.top)
                this.top = box.top + system_js_5.unc;
            if (this.bottom > box.bottom)
                this.bottom = box.bottom - system_js_5.unc;
        }
        collidesWithPoint(x, y) {
            return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
        }
        overlaps(box) {
            return box.left >= this.left && box.top >= this.top && box.right < this.right
                && box.bottom < this.bottom;
        }
        isInside(box) {
            return box.overlaps(this);
        }
    }
    exports.Box = Box;
    exports.serviceSprite1 = new Box();
    exports.serviceSprite2 = new Box();
});
define("src/drag", ["require", "exports", "src/actions/action.js"], function (require, exports, action_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Drag = void 0;
    exports.deleteCurrentDrag = deleteCurrentDrag;
    let current;
    class Drag extends action_js_1.Action {
        conditions() {
            return true;
        }
        start() { }
        process() { }
        end() { }
        execute() {
            if (current === undefined) {
                if (this.key.keyWasPressed && this.conditions()) {
                    this.start();
                    current = this;
                }
            }
            if (current !== this)
                return;
            current.process();
            if (current.key.keyIsDown)
                return;
            current.end();
            current = undefined;
        }
    }
    exports.Drag = Drag;
    function deleteCurrentDrag() {
        current = undefined;
    }
});
define("src/canvas", ["require", "exports", "src/box.js", "src/system", "src/project"], function (require, exports, box_js_6, system_js_6, project_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Canvas = exports.zk = exports.ctx = exports.canvasUnderCursor = exports.currentCanvas = void 0;
    exports.setCanvas = setCanvas;
    exports.xToScreen = xToScreen;
    exports.yToScreen = yToScreen;
    exports.distToScreen = distToScreen;
    exports.xFromScreen = xFromScreen;
    exports.yFromScreen = yFromScreen;
    exports.distFromScreen = distFromScreen;
    exports.zk = 1.2;
    function setCanvas(canvas) {
        exports.currentCanvas = canvas;
        if (canvas.node === undefined)
            return;
        exports.ctx = canvas.node.getContext("2d");
        let rect = canvas.node.getBoundingClientRect();
        system_js_6.canvasMouse.setPosition(system_js_6.screenMouse.x - rect.left, system_js_6.screenMouse.y - rect.top);
        system_js_6.mouse.setPosition(xFromScreen(system_js_6.canvasMouse.x), yFromScreen(system_js_6.canvasMouse.y));
    }
    class Canvas extends box_js_6.Box {
        constructor(node = undefined, x, y, width, height, viewport, active = true) {
            super(x, y, width, height);
            this.node = node;
            this.viewport = viewport;
            this.active = active;
            this.vdx = 1.0;
            this.vdy = 1.0;
            this.k = 1.0;
            this.oldZoom = 0;
            this.defaultPosition = this;
            this.background = "black";
            this.actions = [];
            if (node !== undefined) {
                node.addEventListener("mouseover", () => {
                    exports.canvasUnderCursor = this;
                });
                node.addEventListener("mouseout", () => {
                    exports.canvasUnderCursor = undefined;
                });
            }
            this.updateParameters();
        }
        static create(node, fwidth, fheight, adaptive = true) {
            const k = Math.min(window.innerWidth / fwidth, window.innerHeight / fheight);
            const width = adaptive ? fwidth * k : node.clientWidth;
            const height = adaptive ? fheight * k : node.clientHeight;
            node.width = width;
            node.height = height; // - document.getElementById("tabs").clientHeight * 2
            //node.style.width = width
            //node.style.height = height
            return new Canvas(node, 0.0, 0.0, fwidth, fheight, box_js_6.Box.fromArea(node.offsetLeft, node.offsetTop, width, height));
        }
        renderNode() {
            this.updateParameters();
            let viewport = this.viewport;
            setCanvas(this);
            exports.ctx.fillStyle = this.background;
            //g.setClip(viewport.left, viewport.top, viewport.width, viewport.height)
            exports.ctx.fillRect(0, 0, viewport.width, viewport.height);
            exports.ctx.fillStyle = "white";
            this.render();
        }
        render() {
            project_js_4.project.scene.draw();
        }
        updateNode() {
            if (!this.active)
                return;
            // || !this.viewport.collidesWithPoint(screenMouse.x, screenMouse.y)
            setCanvas(this);
            this.update();
            for (let action of this.actions) {
                action.execute();
            }
        }
        update() {
        }
        add(drag, key = undefined) {
            drag.key = key;
            this.actions.push(drag);
        }
        updateParameters() {
            let viewport = this.viewport;
            let k = viewport.width / this.width;
            this.k = k;
            this.height = viewport.height / k;
            this.vdx = 0.5 * viewport.width - this.x * k;
            this.vdy = 0.5 * viewport.height - this.y * k;
        }
        setZoom(zoom) {
            this.zoom = zoom;
            this.width = this.viewport.width * (exports.zk ** zoom);
            this.updateParameters();
        }
        setZoomXY(zoom, x, y) {
            let fx1 = xFromScreen(x);
            let fy1 = yFromScreen(y);
            this.setZoom(zoom);
            let fx2 = xFromScreen(x);
            let fy2 = yFromScreen(y);
            this.x += fx1 - fx2;
            this.y += fy1 - fy2;
            this.updateParameters();
        }
        hasMouse() {
            return this.viewport.collidesWithPoint(system_js_6.mouse.x, system_js_6.mouse.y);
        }
        setDefaultPosition() {
            this.oldZoom = this.zoom;
            //this.defaultPosition = new Sprite(undefined, undefined, this.x, this.y, this.width, this.height)
        }
        restorePosition() {
            let defaultPosition = this.defaultPosition;
            this.x = defaultPosition.x;
            this.y = defaultPosition.y;
            this.width = defaultPosition.width;
            this.height = defaultPosition.height;
            this.zoom = this.oldZoom;
            this.updateParameters();
        }
        drawDefaultCamera() {
            let pos = this.defaultPosition;
            exports.ctx.fillStyle = "blue";
            exports.ctx.strokeRect(xToScreen(pos.left), yToScreen(pos.top), distToScreen(pos.width), distToScreen(pos.height));
            exports.ctx.fillStyle = "white";
        }
        toggle() {
            this.active = !this.active;
        }
    }
    exports.Canvas = Canvas;
    function xToScreen(fieldX) {
        return fieldX * exports.currentCanvas.k + exports.currentCanvas.vdx;
    }
    function yToScreen(fieldY) {
        return fieldY * exports.currentCanvas.k + exports.currentCanvas.vdy;
    }
    function distToScreen(fieldDist) {
        return fieldDist * exports.currentCanvas.k;
    }
    function xFromScreen(screenX) {
        return (screenX - exports.currentCanvas.vdx) / exports.currentCanvas.k;
    }
    function yFromScreen(screenY) {
        return (screenY - exports.currentCanvas.vdy) / exports.currentCanvas.k;
    }
    function distFromScreen(screenDist) {
        return screenDist / exports.currentCanvas.k;
    }
});
define("src/nine_patch", ["require", "exports", "src/canvas.js", "src/image", "src/shape"], function (require, exports, canvas_js_7, image_js_2, shape_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NinePatch = void 0;
    class NinePatch extends shape_js_2.Shape {
        constructor(image, horizontal1 = 0, horizontal2 = image.width, vertical1 = 0, vertical2 = image.height) {
            super();
            this.texture = image.texture;
            this.x = [0, horizontal1, horizontal2];
            this.y = [0, vertical1, vertical2];
            this.width = [horizontal1, horizontal2 - horizontal1, image.width - horizontal2];
            this.height = [vertical1, vertical2 - vertical1, image.height - vertical2];
        }
        static create(template) {
            let object = template.object;
            if (object === undefined) {
                object = new NinePatch(image_js_2.Img.create(template.image), template.horizontal1, template.horizontal2, template.vertical1, template.vertical2);
                template.object = object;
            }
            return object;
        }
        drawResized(sx, sy, swidth, sheight, shapeType) {
            let x = sx - 0.5 * swidth;
            let y = sy - 0.5 * sheight;
            let x0 = [x, x + this.width[0], x + swidth - this.width[2]];
            let y0 = [y, y + this.height[0], y + sheight - this.height[2]];
            let width0 = [this.width[0], swidth - this.width[0] - this.width[2], this.width[2]];
            let height0 = [this.height[0], sheight - this.height[0] - this.height[2], this.height[2]];
            for (let j = 0; j <= 2; j++) {
                if (this.height[j] <= 0 || height0[j] <= 0)
                    continue;
                for (let i = 0; i <= 2; i++) {
                    if (this.width[i] <= 0 || width0[i] <= 0)
                        continue;
                    canvas_js_7.ctx.drawImage(this.texture, this.x[i], this.y[j], this.width[i], this.height[j], x0[i], y0[j], width0[i] + 1, height0[j] + 1);
                }
            }
        }
        drawRotated(sx, sy, swidth, sheight, shapeType, angle, flipped) {
            this.drawResized(sx, sy, swidth, sheight, shapeType);
        }
    }
    exports.NinePatch = NinePatch;
});
define("src/image", ["require", "exports", "src/canvas.js", "src/input", "src/system", "src/nine_patch", "src/vector_shape"], function (require, exports, canvas_js_8, input_js_3, system_js_7, nine_patch_js_1, vector_shape_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Img = void 0;
    let collisionShape = new vector_shape_js_5.VectorShape("rgb(255, 0, 255)", 0.5);
    class Img {
        constructor(texture, x = 0, y = 0, width = texture.width, height = texture.height, xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
            this.texture = texture;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.xMul = xMul;
            this.yMul = yMul;
            this.widthMul = widthMul;
            this.heightMul = heightMul;
        }
        static create(template) {
            if (template === undefined)
                return;
            if (template.class === "NinePatch") {
                return nine_patch_js_1.NinePatch.create(template);
            }
            let object = template.object;
            if (object === undefined) {
                object = new Img(system_js_7.texture[template.texture], template.x, template.y, template.width, template.height, template.xMul, template.yMul, template.widthMul, template.heightMul);
                template.object = object;
            }
            return object;
        }
        drawResized(sx, sy, swidth, sheight, shapeType) {
            canvas_js_8.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, sx, sy, swidth, sheight);
        }
        drawRotated(sx, sy, swidth, sheight, shapeType, angle, flipped) {
            let newWidth = swidth * this.widthMul;
            let newHeight = sheight * this.heightMul;
            let newX = -newWidth * this.xMul;
            let newY = -newHeight * this.yMul;
            canvas_js_8.ctx.save();
            canvas_js_8.ctx.translate(sx, sy);
            if (flipped)
                canvas_js_8.ctx.scale(-1, 1);
            canvas_js_8.ctx.rotate(angle);
            canvas_js_8.ctx.drawImage(this.texture, this.x, this.y, this.width, this.height, newX, newY, newWidth, newHeight);
            canvas_js_8.ctx.restore();
            if (input_js_3.showCollisionShapes) {
                collisionShape.drawResized(sx - swidth * 0.5, sy - sheight * 0.5, swidth, sheight, shapeType);
            }
        }
    }
    exports.Img = Img;
});
define("src/image_array", ["require", "exports", "src/image.js", "src/texture", "src/system"], function (require, exports, image_js_3, texture_js_1, system_js_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageArray = void 0;
    class ImageArray {
        constructor(texture, columns, rows, xMul = 0.5, yMul = 0.5, widthMul = 1.0, heightMul = 1.0) {
            this.texture = texture;
            this.columns = columns;
            this.rows = rows;
            this.xMul = xMul;
            this.yMul = yMul;
            this.widthMul = widthMul;
            this.heightMul = heightMul;
            this.init(columns, rows);
        }
        init(newColumns, newRows) {
            const tex = this.texture;
            const quantity = newColumns * newRows;
            const width = Math.floor(tex.width / newColumns);
            const height = Math.floor(tex.height / newRows);
            const images = new Array(quantity);
            for (let i = 0; i < quantity; i++) {
                images[i] = new image_js_3.Img((0, texture_js_1.getTexturePart)(tex, (i % newColumns) * width, Math.floor(i / newColumns) * height, width, height), 0, 0, width, height, this.xMul, this.yMul, this.widthMul, this.heightMul);
            }
            this.images = images;
            this.columns = newColumns;
            this.rows = newRows;
        }
        static create(template) {
            let object = template.object;
            if (object === undefined) {
                object = new ImageArray(system_js_8.texture[template.texture], template.columns, template.rows, template.xMul, template.yMul, template.widthMul, template.heightMul);
                template.object = object;
            }
            return object;
        }
        toString() {
            return `new ImageArray(texture.${this.texture.id}, ${this.columns}, ${this.rows}, ${this.xMul}, ${this.yMul}`
                + `, ${this.heightMul}, ${this.widthMul})`;
        }
        image(num) {
            return this.images[num];
        }
        setImage(num, image) {
            this.images[num] = image;
        }
        get quantity() {
            return this.images.length;
        }
    }
    exports.ImageArray = ImageArray;
});
define("src/auto_tiling", ["require", "exports", "src/save_load.js", "src/functions"], function (require, exports, save_load_js_2, functions_js_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pos = exports.Rule = exports.Category = void 0;
    exports.enframeTile = enframeTile;
    exports.enframe = enframe;
    class Category {
        constructor(name, rules = [], prolong = false, columns = undefined) {
            this.name = name;
            this.rules = rules;
            this.prolong = prolong;
            this.columns = columns;
        }
        copy(newName, d) {
            let newRules = new Array(this.rules.length);
            for (let i = 0; i < newRules.length; i++) {
                newRules[i] = this.rules[i].copy(d);
            }
            return new Category(newName, newRules, this.prolong, this.columns);
        }
        move(d) {
            for (let rule of this.rules) {
                rule.move(d);
            }
        }
        convert(toColumns) {
            for (let rule of this.rules) {
                rule.convert(this.columns, toColumns);
            }
            this.columns = toColumns;
        }
        getCorner() {
            let minColumn, minRow;
            for (let rule of this.rules) {
                const column = rule.tile % this.columns;
                const row = (0, functions_js_8.floor)(rule.tile / this.columns);
                if (minColumn === undefined || column < minColumn)
                    minColumn = column;
                if (minRow === undefined || row < minRow)
                    minRow = row;
            }
            return minColumn + minRow * this.columns;
        }
        normalized(newName) {
            let text = "";
            let d = this.getCorner();
            for (let rule of this.rules) {
                text += `\t${rule.normalized(d)}, \n`;
            }
            return `new Category("${newName}", \n${text}, ${this.prolong}, ${this.columns})`;
        }
        toString() {
            return `new Category("${this.name}", ${(0, save_load_js_2.arrayToString)(this.rules, 1)}, ${this.prolong}, ${this.columns})`;
        }
    }
    exports.Category = Category;
    class Rule {
        constructor(tile = 0, positions = []) {
            this.tile = tile;
            this.positions = positions;
        }
        copy(d) {
            let newPositions = new Array(this.positions.length);
            for (let i = 0; i < newPositions.length; i++) {
                newPositions[i] = this.positions[i].copy();
            }
            return new Rule(this.tile + d, newPositions);
        }
        move(d) {
            this.tile += d;
        }
        convert(fromColumns, toColumns) {
            const column = this.tile % fromColumns;
            const row = (0, functions_js_8.floor)(this.tile / fromColumns);
            this.tile = column + row * toColumns;
        }
        normalized(d) {
            return `new Rule(${this.tile - d}, ${(0, save_load_js_2.arrayToString)(this.positions)})`;
        }
        toString() {
            return `new Rule(${this.tile}, ${(0, save_load_js_2.arrayToString)(this.positions)})`;
        }
    }
    exports.Rule = Rule;
    class Pos {
        constructor(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }
        copy() {
            return new Pos(this.dx, this.dy);
        }
        toString() {
            return `new Pos(${this.dx}, ${this.dy})`;
        }
    }
    exports.Pos = Pos;
    function findTileCategory(map, column, row, prolong = false) {
        if (prolong) {
            if (column < 0)
                column = 0;
            if (column >= map.columns)
                column = map.columns - 1;
            if (row < 0)
                row = 0;
            if (row >= map.rows)
                row = map.rows - 1;
        }
        else {
            if (column < 0 || column >= map.columns || row < 0 || row >= map.rows)
                return undefined;
        }
        let tileNum = map.tileByPos(column, row);
        for (let category of map.tileSet.categories) {
            for (let rule of category.rules) {
                if (rule.tile === tileNum)
                    return category;
            }
        }
        return undefined;
    }
    function enframeTile(map, column, row) {
        let tileCategory = findTileCategory(map, column, row, false);
        if (tileCategory === undefined)
            return;
        let prolong = tileCategory.prolong;
        rule: for (let rule of tileCategory.rules) {
            for (let pos of rule.positions) {
                let category = findTileCategory(map, pos.dx + column, pos.dy + row, prolong);
                if (category === tileCategory)
                    continue rule;
            }
            map.setTileByPos(column, row, rule.tile);
            return;
        }
    }
    function enframe(map) {
        for (let row = 0; row < map.rows; row++) {
            for (let column = 0; column < map.columns; column++) {
                enframeTile(map, column, row);
            }
        }
    }
});
define("src/tile_set", ["require", "exports", "src/project.js", "src/save_load", "src/texture", "src/block", "src/functions"], function (require, exports, project_js_5, save_load_js_3, texture_js_2, block_js_1, functions_js_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TileSet = exports.Visibility = void 0;
    var Visibility;
    (function (Visibility) {
        Visibility[Visibility["visible"] = 0] = "visible";
        Visibility[Visibility["hidden"] = 1] = "hidden";
        Visibility[Visibility["block"] = 2] = "block";
    })(Visibility || (exports.Visibility = Visibility = {}));
    class TileSet {
        constructor(images, visibility = undefined, blocks = [], categories = [], altTile = -1, groups = []) {
            this.blocks = blocks;
            this.categories = categories;
            this.altTile = altTile;
            this.groups = groups;
            this.collision = [];
            this.images = images;
            this.visibility = visibility ? visibility : [].fill(Visibility.visible, 0, images.quantity);
        }
        toString() {
            return `new TileSet(${this.images.toString()}, ${(0, save_load_js_3.arrayToString)(this.visibility, this.columns, 1)}`
                + `, ${(0, save_load_js_3.arrayToString)(this.blocks, 2)}, ${(0, save_load_js_3.arrayToString)(this.categories, 1)}`
                + `, ${this.altTile}, ${(0, save_load_js_3.arrayToString)(this.groups)})`;
        }
        get name() {
            for (let [key, set] of Object.entries(project_js_5.tileSet)) {
                if (this === set)
                    return key;
            }
            return "";
        }
        get texture() {
            return this.images.texture;
        }
        get images() {
            return this.images;
        }
        set images(value) {
            this.images = value;
        }
        image(num) {
            return this.images.image(num);
        }
        get columns() {
            return this.images.columns;
        }
        get rows() {
            return this.images.rows;
        }
        get quantity() {
            return this.images.quantity;
        }
        tileNumByPos(column, row) {
            return column + row * this.columns;
        }
        tileColumnByIndex(index) {
            return index % this.columns;
        }
        tileRowByIndex(index) {
            return Math.floor(index / this.columns);
        }
        addRegion(region, type) {
            this.addBlock(region.x, region.y, region.width + 1, region.height + 1, type);
        }
        addBlock(x, y, width, height, type) {
            const block = new block_js_1.Block(x, y, width, height, type);
            this.setBlockVisibility(block, Visibility.block);
            this.initBlockImage(block);
            this.blocks.push(block);
        }
        initBlockImage(block) {
            const size = this.images.width;
            block.texture = (0, texture_js_2.getTexturePart)(this.images.texture, block.x * size, block.y * size, block.width * size, block.height * size);
        }
        setBlockVisibility(block, vis) {
            for (let row = block.y; row < block.y + block.height; row++) {
                for (let column = block.x; column < block.x + block.width; column++) {
                    this.visibility[column + row * this.columns] = vis;
                }
            }
        }
        removeBlock(x, y) {
            for (let block of this.blocks) {
                if (block.collidesWithTile(x, y)) {
                    this.setBlockVisibility(block, Visibility.visible);
                    (0, functions_js_9.removeFromArray)(block, this.blocks);
                    return;
                }
            }
        }
        collisionShape(num) {
            return this.collision[num];
        }
        setCollision(sprite, from = 0, to = undefined) {
            if (to === undefined) {
                to = this.collision.length;
            }
            for (let tileNum = from; tileNum <= to; tileNum++) {
                this.collision[tileNum] = sprite;
            }
        }
        setCollisionFromArray(sprite, array) {
            for (let tileNum of array) {
                this.collision[tileNum] = sprite;
            }
            return;
        }
    }
    exports.TileSet = TileSet;
});
define("src/parser", ["require", "exports", "src/project.js", "src/tile_set", "src/image_array", "src/tile_map", "src/block", "src/auto_tiling", "src/system", "src/layer", "src/names"], function (require, exports, project_js_6, tile_set_js_1, image_array_js_1, tile_map_js_1, block_js_2, auto_tiling_js_1, system_js_9, layer_js_1, names_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initParser = initParser;
    exports.getSymbol = getSymbol;
    exports.isDigit = isDigit;
    exports.isTokenSymbol = isTokenSymbol;
    exports.getSymbols = getSymbols;
    exports.getToken = getToken;
    exports.getBoolean = getBoolean;
    exports.getInt = getInt;
    exports.getFloat = getFloat;
    exports.getString = getString;
    exports.getBooleanArray = getBooleanArray;
    exports.getIntArray = getIntArray;
    exports.getStringArray = getStringArray;
    exports.readSymbol = readSymbol;
    exports.eof = eof;
    exports.getCategory = getCategory;
    exports.getCategories = getCategories;
    exports.getImageArray = getImageArray;
    exports.getTileSet = getTileSet;
    exports.getTileMap = getTileMap;
    exports.getLayer = getLayer;
    let pos, text;
    function initParser(newText) {
        text = newText;
        pos = 0;
    }
    function getSymbol(symbol, terminator = undefined) {
        while (text.charAt(pos) !== symbol) {
            if (text.charAt(pos) === terminator)
                return false;
            if (pos > text.length)
                throw new Error("file end reached");
            pos++;
        }
        pos++;
        return true;
    }
    function isDigit(symbol) {
        return (symbol >= "0" && symbol <= "9") || symbol === '-';
    }
    function isTokenSymbol(symbol) {
        if (symbol >= "0" && symbol <= "9")
            return true;
        if (symbol >= "A" && symbol <= "Z")
            return true;
        if (symbol >= "a" && symbol <= "z")
            return true;
        return symbol === "_";
    }
    function getSymbols(comparison, terminator = undefined) {
        while (!comparison(text.charAt(pos))) {
            if (pos > text.length)
                throw new Error("file end reached");
            if (text.charAt(pos) === terminator)
                return "";
            pos++;
        }
        const start = pos;
        while (comparison(text.charAt(pos))) {
            if (pos > text.length)
                throw new Error("file end reached");
            pos++;
        }
        return text.substring(start, pos);
    }
    function getToken(terminator = undefined) {
        return getSymbols(symbol => {
            return isTokenSymbol(symbol);
        }, terminator);
    }
    function getBoolean(terminator = undefined) {
        const value = getSymbols(symbol => {
            return isTokenSymbol(symbol);
        }, terminator);
        return value === "true";
    }
    function getInt(terminator = undefined) {
        const num = getSymbols(symbol => {
            return isDigit(symbol);
        }, terminator);
        return num === "" ? undefined : parseInt(num);
    }
    function getFloat(terminator = undefined) {
        const num = getSymbols(symbol => {
            return isDigit(symbol) || symbol === ".";
        }, terminator);
        return num === "" ? undefined : parseFloat(num);
    }
    function getString(terminator = undefined) {
        if (getSymbol('"', terminator) === false)
            return "";
        return getSymbols(symbol => {
            return symbol !== '"';
        }, terminator);
    }
    function getBooleanArray(values) {
        const array = [];
        for (let i = 0; i < values.length; i++) {
            array.push(values.charAt(i) === "1");
        }
        return array;
    }
    function getIntArray(terminator = undefined) {
        if (!getSymbol("[", terminator))
            return undefined;
        const array = [];
        while (true) {
            const num = getInt("]");
            if (num === undefined)
                return array;
            array.push(num);
        }
    }
    function getStringArray(terminator = undefined) {
        if (!getSymbol("[", terminator))
            return undefined;
        const array = [];
        while (true) {
            const string = getString("]");
            if (string === "")
                return array;
            array.push(string);
            pos++;
        }
    }
    function readSymbol() {
        const char = text.charAt(pos);
        pos++;
        return char;
    }
    function eof() {
        return pos >= text.length;
    }
    function getBlocks() {
        const array = [];
        getSymbol("[");
        while (true) {
            const x = getInt("]");
            if (x === undefined) {
                pos++;
                return array;
            }
            const y = getInt();
            const width = getInt();
            const height = getInt();
            const type = getInt();
            array.push(new block_js_2.Block(x, y, width, height, type));
        }
    }
    function getPositions() {
        const array = [];
        getSymbol("[");
        while (true) {
            const dx = getInt("]");
            if (dx === undefined) {
                pos++;
                return array;
            }
            const dy = getInt();
            array.push(new auto_tiling_js_1.Pos(dx, dy));
        }
    }
    function getRules() {
        const array = [];
        getSymbol("[");
        while (true) {
            const tiles = getInt("]");
            if (tiles === undefined) {
                pos++;
                return array;
            }
            const positions = getPositions();
            array.push(new auto_tiling_js_1.Rule(tiles, positions));
        }
    }
    function getCategory() {
        const name = getString();
        const rules = getRules();
        const prolong = getBoolean();
        const columns = getInt();
        return new auto_tiling_js_1.Category(name, rules, prolong, columns);
    }
    function getCategories(columns) {
        const array = [];
        getSymbol("[");
        while (true) {
            const name = getString("]");
            if (name === "") {
                pos++;
                return array;
            }
            const rules = getRules();
            const prolong = getBoolean();
            getInt();
            array.push(new auto_tiling_js_1.Category(name, rules, prolong, columns));
        }
    }
    function getImageArray() {
        const name = getToken();
        getSymbol(".");
        const textureName = getToken();
        const columns = getInt();
        const rows = getInt();
        const xMul = getFloat();
        const yMul = getFloat();
        const heightMul = getFloat();
        const widthMul = getFloat();
        project_js_6.imageArray[name] = new image_array_js_1.ImageArray(system_js_9.texture[textureName], columns, rows, xMul, yMul, heightMul, widthMul);
        let t = text.substring(0, pos);
        getSymbol(")");
    }
    function getTileSet() {
        getSymbol(".");
        const name = getToken();
        getSymbol(".");
        const array = project_js_6.imageArray[getToken()];
        const visibility = getIntArray();
        const blocks = getBlocks();
        const categories = getCategories(array.columns);
        //const prolong = getInt()
        const altTile = getInt();
        const groups = getIntArray();
        project_js_6.tileSet[name] = new tile_set_js_1.TileSet(array, visibility, blocks, categories, altTile, groups);
        getSymbol(")");
    }
    function getTileMap(layer = undefined) {
        const name = getToken();
        getSymbol(".");
        const tileSetName = getToken();
        const mapTileSet = project_js_6.tileSet[tileSetName];
        const columns = getInt();
        const rows = getInt();
        const x = getFloat();
        const y = getFloat();
        const cellWidth = getFloat();
        const cellHeight = getFloat();
        const array = getIntArray();
        const map = new tile_map_js_1.TileMap(mapTileSet, columns, rows, x, y, cellWidth, cellHeight, array);
        if (layer === undefined) {
            project_js_6.tileMap[name] = map;
            project_js_6.world.add(map);
        }
        else {
            layer.add(map);
        }
        getSymbol(")");
    }
    function getLayer() {
        let name = getToken();
        getSymbol("(");
        const l = new layer_js_1.Layer();
        while (true) {
            if (!getSymbol("(", ")"))
                break;
            getTileMap(l);
        }
        project_js_6.layer[name] = l;
        (0, names_js_1.setName)(l, name);
        project_js_6.world.add(l);
    }
});
define("src/names", ["require", "exports", "src/parser.js"], function (require, exports, parser_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getName = getName;
    exports.setName = setName;
    exports.incrementName = incrementName;
    let objectName = new Map();
    function getName(object) {
        return objectName.get(object);
    }
    function setName(object, name) {
        objectName.set(object, name);
    }
    function incrementName(name) {
        let num = "";
        while (name !== "") {
            let char = name.charAt(name.length - 1);
            if (!(0, parser_js_1.isDigit)(char) || char === "-")
                break;
            num = char + num;
            name = name.substring(0, name.length - 1);
        }
        if (num === "")
            return name + "2";
        return name + (parseInt(num) + 1);
    }
});
//import {initData, tileMap, tileMaps, tileSet} from "./project.js"
//import {getString, getSymbol, getTileMap, getTileSet, getToken, initParser} from "./parser.js"
//import {getName} from "./names.js"
define("src/save_load", ["require", "exports", "src/project.js", "src/names", "src/parser", "src/tile_map", "src/system"], function (require, exports, project_js_7, names_js_2, parser_js_2, tile_map_js_2, system_js_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.indent = void 0;
    exports.addIndent = addIndent;
    exports.removeIndent = removeIndent;
    exports.toString = toString;
    exports.arrayToString = arrayToString;
    exports.booleanArrayToString = booleanArrayToString;
    exports.projectToText = projectToText;
    exports.loadTextures = loadTextures;
    exports.projectFromText = projectFromText;
    exports.indent = "";
    function addIndent() {
        exports.indent += "\t";
    }
    function removeIndent() {
        exports.indent = exports.indent.substring(1);
    }
    function toString(value) {
        if (value instanceof Array) {
            let text = "";
            for (let item of value) {
                text += "," + toString(item);
            }
            return `[${text.substring(1)}]`;
        }
        if (value instanceof Object) {
            return value.toString();
        }
        return value;
    }
    function arrayToString(array, columns = undefined, padding = 0) {
        let text = "[";
        addIndent();
        for (let pos = 0; pos < array.length; pos++) {
            if (columns !== undefined && (pos % columns) === 0) {
                text += `\n${exports.indent}`;
            }
            let item = array[pos];
            text += (columns === undefined ? toString(item) : item.toString().padStart(padding, " ")) + ", ";
        }
        removeIndent();
        return text + (columns === undefined || array.length === 0 ? "" : "\n" + exports.indent) + "]";
    }
    function booleanArrayToString(array) {
        let text = "";
        addIndent();
        for (let value of array) {
            text += value ? "1" : "0";
        }
        removeIndent();
        return `\"${text}\"`;
    }
    function projectToText() {
        const path = "../Furca/src";
        let text = "";
        text += `import {TileSet} from "${path}/tile_set.js"\n`;
        text += `import {TileMap} from "${path}/tile_map.js"\n`;
        text += `import {ImageArray} from "${path}/image_array.js"\n`;
        text += `import {layer, tileMap, tileSet, project} from "${path}/project.js"\n`;
        text += `import {Block} from "${path}/block.js"\n`;
        text += `import {Category, Pos, Rule} from "${path}/auto_tiling.js"\n`;
        text += `import {texture} from "${path}/system.js"\n`;
        text += `import {Layer} from "${path}/layer.js"\n\n`;
        text += `project.texturePath = ${project_js_7.project.texturePath}\n`;
        text += `project.textures = [`;
        const textureSet = new Set();
        for (let set of Object.values(project_js_7.tileSet)) {
            const tex = set.images.texture;
            if (textureSet.has(tex))
                continue;
            text += `"${tex.fileName}", `;
        }
        text += ']\n\nexport function loadData() {\n';
        exports.indent = "\t";
        for (const [name, images] of Object.entries(project_js_7.imageArray)) {
            text += `\timageArray.${name} = ${images.toString()}\n`;
        }
        text += "\n";
        for (const [name, set] of Object.entries(project_js_7.tileSet)) {
            text += `\ttileSet.${name} = ${set.toString()}\n`;
        }
        text += "\t\n";
        for (let object of project_js_7.world.items) {
            text += `\t${object instanceof tile_map_js_2.TileMap ? "tileMap" : "layer"}.${(0, names_js_2.getName)(object)} = ${object.toString()}\n`;
        }
        return text + "}";
    }
    function loadTextures(data, func) {
        (0, parser_js_2.initParser)(data);
        (0, parser_js_2.getSymbol)("=");
        project_js_7.project.texturePath = (0, parser_js_2.getString)();
        (0, parser_js_2.getSymbol)("=");
        project_js_7.project.textures = (0, parser_js_2.getStringArray)();
        for (const textureFileName of project_js_7.project.textures) {
            (0, system_js_10.loadTexture)(textureFileName, func);
        }
    }
    function projectFromText(data) {
        (0, parser_js_2.initParser)(data);
        (0, parser_js_2.getSymbol)("(");
        (0, parser_js_2.getSymbol)("{");
        while (true) {
            let token = (0, parser_js_2.getToken)("}");
            if (token === "")
                break;
            switch (token) {
                case "tileSet":
                    (0, parser_js_2.getTileSet)();
                    break;
                case "tileMap":
                    (0, parser_js_2.getTileMap)();
                    break;
                case "imageArray":
                    (0, parser_js_2.getImageArray)();
                    break;
                case "layer":
                    (0, parser_js_2.getLayer)();
                    break;
                default:
                    console.log("Wrong token " + token);
            }
        }
    }
});
define("src/layer", ["require", "exports", "src/save_load.js", "src/functions", "src/tile_map", "src/shape"], function (require, exports, save_load_js_4, functions_js_10, tile_map_js_3, shape_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Layer = void 0;
    class Layer extends shape_js_3.Shape {
        constructor(...items) {
            super();
            this.visible = true;
            this.active = true;
            this.items = items;
        }
        copy(dx = 0, dy = 0) {
            const newLayer = new Layer();
            for (let item of this.items) {
                newLayer.add(item.copy(dx, dy));
            }
            return newLayer;
        }
        toString() {
            let text = `new Layer(`;
            (0, save_load_js_4.addIndent)();
            for (const item of this.items) {
                text += `\n${save_load_js_4.indent}${item.toString()},`;
            }
            (0, save_load_js_4.removeIndent)();
            return `${text}${save_load_js_4.indent})`;
        }
        draw() {
            if (!this.visible)
                return;
            for (const item of this.items) {
                item.draw();
            }
        }
        drawDashedRegion(isCircle) {
            for (const item of this.items) {
                item.drawDashedRegion(isCircle);
            }
        }
        update() {
            if (!this.active)
                return;
            for (const item of this.items) {
                item.update();
            }
        }
        // items management
        get quantity() {
            return this.items.length;
        }
        get isEmpty() {
            return this.items.length === 0;
        }
        clear() {
            this.items = [];
        }
        has(item) {
            return this.items.indexOf(item) >= 0;
        }
        add(...objects) {
            Array.prototype.push.apply(this.items, objects);
        }
        replace(index, object) {
            this.items[index] = object;
        }
        remove(object) {
            for (let item of this.items) {
                if (item === object) {
                    (0, functions_js_10.removeFromArray)(object, this.items);
                    return;
                }
                item.remove(object);
            }
        }
        removeAll(itemsToRemove) {
            for (const item of itemsToRemove) {
                this.remove(item);
            }
            itemsToRemove.length = 0;
        }
        // sprite manipulations
        move() {
            for (const item of this.items) {
                item.move();
            }
        }
        setPositionAs(sprite) {
            for (const item of this.items) {
                item.setPositionAs(sprite);
            }
        }
        wrap(bounds) {
            for (const item of this.items) {
                item.wrap(bounds);
            }
        }
        turn(angle) {
            for (const item of this.items) {
                item.turn(angle);
            }
        }
        turnImage(angle) {
            for (const item of this.items) {
                item.turnImage(angle);
            }
        }
        hide() {
            this.visible = false;
        }
        show() {
            this.visible = true;
        }
        processSprites(code) {
            for (const item of this.items) {
                item.processSprites(code);
            }
        }
        findTileMapByTileSet(tileSet) {
            for (const item of this.items) {
                if (item instanceof tile_map_js_3.TileMap && item.tileSet === tileSet)
                    return item;
            }
        }
        // collisions
        firstCollisionWithPoint(x, y) {
            for (let item of this.items) {
                let collided = item.firstCollisionWithPoint(x, y);
                if (collided !== undefined) {
                    return collided;
                }
            }
            return undefined;
        }
        collidesWithPoint(x, y) {
            for (let item of this.items) {
                if (item.collidesWithPoint(x, y))
                    return true;
            }
            return false;
        }
        collisionWithSprite(sprite, code) {
            for (const item of this.items) {
                item.collisionWithSprite(sprite, code);
            }
        }
        collisionWithTileMap(tileMap, code) {
            this.items.forEach(item => item.collisionWithTileMap(tileMap, code));
        }
        collisionWithPoint(x, y, code) {
            this.items.forEach(item => item.collisionWithPoint(x, y, code));
        }
        overlaps(box) {
            for (let item of this.items) {
                if (item.overlaps(box))
                    return true;
            }
        }
        isInside(box) {
            for (let item of this.items) {
                if (!item.isInside(box))
                    return false;
            }
            return true;
        }
    }
    exports.Layer = Layer;
});
define("src/project", ["require", "exports", "src/layer.js", "src/canvas"], function (require, exports, layer_js_2, canvas_js_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.project = exports.imageArray = exports.world = exports.layer = exports.tileMap = exports.tileSet = void 0;
    exports.initData = initData;
    exports.setWorld = setWorld;
    function initData() {
        exports.imageArray = new Map();
        exports.tileSet = new Map();
        exports.tileMap = new Map();
        exports.layer = new Map();
        exports.world = new layer_js_2.Layer();
    }
    function setWorld(newWorld) {
        exports.world = newWorld;
    }
    exports.project = {
        texturePath: "",
        textures: [],
        soundPath: "",
        sounds: [],
        locale: "en",
        locales: {},
        scene: new layer_js_2.Layer(),
        actions: [],
        render() {
        },
        renderNode() {
            this.render();
            canvas_js_9.currentCanvas.renderNode();
        },
        init: () => { },
        update() {
        },
        updateNode() {
            this.update();
            for (const action of this.actions) {
                action.execute();
            }
            this.scene.update();
        },
    };
});
define("editor/create_tile_map", ["require", "exports", "src/tile_map.js", "src/project", "src/parser", "src/names", "src/layer"], function (require, exports, tile_map_js_4, project_js_8, parser_js_3, names_js_3, layer_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addObject = addObject;
    exports.createTileMap = createTileMap;
    function addObject(name, object) {
        (0, names_js_3.setName)(object, name);
        if (object instanceof layer_js_3.Layer) {
            project_js_8.layer[name] = object;
        }
        else {
            project_js_8.tileMap[name] = object;
        }
        project_js_8.world.add(object);
    }
    function createTileMap(string, set, columns, rows, cornerX, cornerY) {
        function newMap(name, x, y) {
            addObject(name, new tile_map_js_4.TileMap(set, columns, rows, x, y, 1, 1));
        }
        let fromX = 0, toX = 0, fromY = 0, toY = 0;
        let template = "";
        (0, parser_js_3.initParser)(string);
        while (!(0, parser_js_3.eof)()) {
            let sym = (0, parser_js_3.readSymbol)();
            if (sym === "\\") {
                (0, parser_js_3.getSymbol)("(");
                let variable = (0, parser_js_3.getToken)();
                (0, parser_js_3.getSymbol)("=");
                let from = (0, parser_js_3.getInt)();
                (0, parser_js_3.getSymbol)(".");
                (0, parser_js_3.getSymbol)(".");
                let to = (0, parser_js_3.getInt)();
                (0, parser_js_3.getSymbol)(")");
                switch (variable) {
                    case "x":
                        fromX = from;
                        toX = to;
                        template += "\\x";
                        break;
                    case "y":
                        fromY = from;
                        toY = to;
                        template += "\\y";
                        break;
                    default:
                        throw new Error("Invalid variable name");
                }
            }
            else {
                template += sym;
            }
        }
        for (let y = fromY; y <= toY; y++) {
            for (let x = fromX; x <= toX; x++) {
                let name = template.replace("\\x", "" + x).replace("\\y", "" + y);
                newMap(name, cornerX + (x - fromX) * (columns + 1), cornerY + (y - fromY) * (rows + 1));
            }
        }
    }
});
define("editor/select_tile_maps", ["require", "exports", "src/drag.js", "src/box", "src/system", "editor/tile_map", "src/project", "../../RuWebQuest 2/src/functions.js"], function (require, exports, drag_js_1, box_js_7, system_js_11, tile_map_js_5, project_js_9, functions_js_11) {
    "use strict";
    var _SelectTileMaps_x, _SelectTileMaps_y;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectTileMaps = exports.mapSelectionRegion = exports.selectedObjects = void 0;
    exports.clearSelection = clearSelection;
    exports.selectedObjects = [];
    class SelectTileMaps extends drag_js_1.Drag {
        constructor() {
            super(...arguments);
            _SelectTileMaps_x.set(this, void 0);
            _SelectTileMaps_y.set(this, void 0);
        }
        conditions() {
            return tile_map_js_5.objectUnderCursor === undefined && tile_map_js_5.currentMode === tile_map_js_5.mode.maps;
        }
        start() {
            __classPrivateFieldSet(this, _SelectTileMaps_x, system_js_11.mouse.x, "f");
            __classPrivateFieldSet(this, _SelectTileMaps_y, system_js_11.mouse.y, "f");
            exports.mapSelectionRegion = new box_js_7.Box();
        }
        process() {
            exports.mapSelectionRegion.setSize(system_js_11.mouse.x - __classPrivateFieldGet(this, _SelectTileMaps_x, "f"), system_js_11.mouse.y - __classPrivateFieldGet(this, _SelectTileMaps_y, "f"));
            exports.mapSelectionRegion.setCorner(__classPrivateFieldGet(this, _SelectTileMaps_x, "f"), __classPrivateFieldGet(this, _SelectTileMaps_y, "f"));
        }
        end() {
            exports.selectedObjects = [];
            exports.mapSelectionRegion.width = (0, functions_js_11.abs)(exports.mapSelectionRegion.width);
            exports.mapSelectionRegion.height = (0, functions_js_11.abs)(exports.mapSelectionRegion.height);
            for (const object of project_js_9.world.items) {
                if (object.isInside(exports.mapSelectionRegion))
                    exports.selectedObjects.push(object);
            }
            exports.mapSelectionRegion = undefined;
        }
    }
    exports.SelectTileMaps = SelectTileMaps;
    _SelectTileMaps_x = new WeakMap(), _SelectTileMaps_y = new WeakMap();
    function clearSelection() {
        exports.selectedObjects = [];
    }
});
define("src/gui/window", ["require", "exports", "src/system.js", "src/canvas"], function (require, exports, system_js_12, canvas_js_10) {
    "use strict";
    var _Win_node, _Win_canvases;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Win = exports.windows = exports.currentWindow = void 0;
    exports.hideWindow = hideWindow;
    exports.windows = [];
    class Win {
        constructor(name) {
            _Win_node.set(this, void 0);
            _Win_canvases.set(this, []);
            __classPrivateFieldSet(this, _Win_node, (0, system_js_12.element)(name), "f");
        }
        init() { }
        onClose() { }
        addCanvas(name, fwidth, fheight) {
            let canvas = canvas_js_10.Canvas.create((0, system_js_12.element)(name), fwidth, fheight, false);
            __classPrivateFieldGet(this, _Win_canvases, "f").push(canvas);
            return canvas;
        }
        renderNode() {
            for (let canvas of __classPrivateFieldGet(this, _Win_canvases, "f")) {
                canvas.renderNode();
            }
        }
        updateNode() {
            this.update();
            for (let canvas of __classPrivateFieldGet(this, _Win_canvases, "f")) {
                canvas.updateNode();
            }
        }
        update() {
        }
        open() {
            //hideWindow()
            this.init();
            __classPrivateFieldGet(this, _Win_node, "f").style.visibility = "visible";
            if (exports.currentWindow !== undefined)
                exports.windows.push(exports.currentWindow);
            exports.currentWindow = this;
        }
        close() {
            this.onClose();
            __classPrivateFieldGet(this, _Win_node, "f").style.visibility = "hidden";
            if (exports.windows.length > 0) {
                exports.currentWindow = exports.windows.pop();
            }
            else {
                exports.currentWindow = undefined;
            }
        }
    }
    exports.Win = Win;
    _Win_node = new WeakMap(), _Win_canvases = new WeakMap();
    function hideWindow() {
        if (exports.currentWindow === undefined)
            return;
        exports.currentWindow.close();
    }
});
define("editor/input", ["require", "exports", "src/system.js", "src/input"], function (require, exports, system_js_13, input_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.enterString = enterString;
    exports.confirm = confirm;
    const enterStringWindow = (0, system_js_13.element)("enter_string");
    const enterStringCaption = (0, system_js_13.element)("string_caption");
    const enterStringField = (0, system_js_13.element)("string");
    const stringOk = (0, system_js_13.element)("string_ok");
    const stringCancel = (0, system_js_13.element)("string_cancel");
    function enterString(caption, defaultValue, okFunc, cancelFunc = undefined) {
        (0, input_js_4.setKeyBlock)(true);
        enterStringWindow.style.visibility = "visible";
        enterStringField.value = defaultValue;
        enterStringCaption.innerText = caption;
        stringOk.onclick = () => {
            (0, input_js_4.setKeyBlock)(false);
            enterStringWindow.style.visibility = "hidden";
            okFunc(enterStringField.value);
        };
        stringCancel.onclick = () => {
            (0, input_js_4.setKeyBlock)(false);
            enterStringWindow.style.visibility = "hidden";
            if (cancelFunc !== undefined)
                cancelFunc();
        };
    }
    const confirmWindow = (0, system_js_13.element)("confirm");
    const confirmCaption = (0, system_js_13.element)("confirm_caption");
    const confirmYes = (0, system_js_13.element)("confirm_yes");
    const confirmNo = (0, system_js_13.element)("confirm_no");
    function confirm(caption, yesFunc, noFunc = undefined) {
        confirmWindow.style.visibility = "visible";
        confirmCaption.innerText = caption;
        (0, input_js_4.setKeyBlock)(true);
        confirmYes.onclick = () => {
            (0, input_js_4.setKeyBlock)(false);
            confirmWindow.style.visibility = "hidden";
            yesFunc();
        };
        confirmNo.onclick = () => {
            (0, input_js_4.setKeyBlock)(false);
            confirmWindow.style.visibility = "hidden";
            if (noFunc !== undefined)
                noFunc();
        };
    }
});
define("editor/new_map", ["require", "exports", "src/system.js", "src/gui/window", "src/project", "editor/create_tile_map", "editor/input"], function (require, exports, system_js_14, window_js_1, project_js_10, create_tile_map_js_1, input_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tileSetSelectionWindow = exports.mapSizeWindow = void 0;
    exports.initTileSetSelectionWindow = initTileSetSelectionWindow;
    exports.newMap = newMap;
    let currentName = "", newX, newY;
    let tileSets = (0, system_js_14.element)("tile_sets");
    let columnsField = (0, system_js_14.element)("columns");
    let rowsField = (0, system_js_14.element)("rows");
    exports.mapSizeWindow = new window_js_1.Win("map_size");
    exports.tileSetSelectionWindow = new window_js_1.Win("select_tile_set");
    function initTileSetSelectionWindow() {
        (0, system_js_14.element)("map_size_ok").onclick = () => {
            tileSets.innerHTML = "";
            for (const [name, set] of Object.entries(project_js_10.tileSet)) {
                let button = document.createElement("button");
                button.innerText = name;
                button["tileSet"] = set;
                button.onclick = (event) => {
                    (0, create_tile_map_js_1.createTileMap)(currentName, event.target["tileSet"], parseInt(columnsField.value), parseInt(rowsField.value), newX, newY);
                    exports.tileSetSelectionWindow.close();
                };
                tileSets.appendChild(button);
            }
            exports.mapSizeWindow.close();
            exports.tileSetSelectionWindow.open();
        };
    }
    function newMap() {
        newX = Math.round(system_js_14.mouse.x);
        newY = Math.round(system_js_14.mouse.y);
        (0, input_js_5.enterString)("Введите название новой карты:", "", (name) => {
            currentName = name;
            exports.mapSizeWindow.open();
        }, () => {
            (0, window_js_1.hideWindow)();
        });
    }
});
define("editor/select_map_region", ["require", "exports", "src/system.js", "src/drag", "editor/tile_set", "src/block", "editor/tile_map"], function (require, exports, system_js_15, drag_js_2, tile_set_js_2, block_js_3, tile_map_js_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectMapRegion = exports.regionTileSet = exports.regionTileMap = exports.mapRegion = void 0;
    class SelectMapRegion extends drag_js_2.Drag {
        conditions() {
            return tile_map_js_6.currentTileMap !== undefined
                && ((tile_set_js_2.currentBlock !== undefined && tile_set_js_2.currentBlock.type === block_js_3.BlockType.frame) || tile_map_js_6.rectangleMode);
        }
        start() {
            this.x = Math.floor((system_js_15.mouse.x - tile_map_js_6.currentTileMap.left) / tile_map_js_6.currentTileMap.cellWidth);
            this.y = Math.floor((system_js_15.mouse.y - tile_map_js_6.currentTileMap.top) / tile_map_js_6.currentTileMap.cellHeight);
            exports.mapRegion = new block_js_3.Block();
            exports.regionTileMap = tile_map_js_6.currentTileMap;
            exports.regionTileSet = tile_set_js_2.currentTileSet;
        }
        process() {
            let width = Math.floor((system_js_15.mouse.x - exports.regionTileMap.left) / exports.regionTileMap.cellWidth) - this.x;
            let height = Math.floor((system_js_15.mouse.y - exports.regionTileMap.top) / exports.regionTileMap.cellHeight) - this.y;
            if (this.x + width < 0)
                width = -this.x;
            if (this.x + width >= exports.regionTileMap.columns)
                width = exports.regionTileMap.columns - this.x - 1;
            if (this.y + height < 0)
                height = -this.y;
            if (this.y + height >= exports.regionTileMap.rows)
                height = exports.regionTileMap.rows - this.y - 1;
            if (tile_set_js_2.currentBlock !== undefined) {
                if (tile_set_js_2.currentBlock.type === block_js_3.BlockType.block) {
                    if (width < tile_set_js_2.currentBlock.width - 1)
                        width = tile_set_js_2.currentBlock.width - 1;
                    if (height < tile_set_js_2.currentBlock.height - 1)
                        height = tile_set_js_2.currentBlock.height - 1;
                    width = Math.floor((width + 1) / tile_set_js_2.currentBlock.width) * tile_set_js_2.currentBlock.width - 1;
                    height = Math.floor((height + 1) / tile_set_js_2.currentBlock.height) * tile_set_js_2.currentBlock.height - 1;
                }
                else if (tile_set_js_2.currentBlock.type === block_js_3.BlockType.frame) {
                    if (tile_set_js_2.currentBlock.width < 3)
                        width = tile_set_js_2.currentBlock.width - 1;
                    if (tile_set_js_2.currentBlock.height < 3)
                        height = tile_set_js_2.currentBlock.height - 1;
                }
            }
            exports.mapRegion.modify(exports.regionTileSet.images.columns, this.x, this.y, width, height);
        }
        end() {
            (0, tile_map_js_6.setBlockSize)(exports.mapRegion.width + 1, exports.mapRegion.height + 1);
            (0, tile_map_js_6.setTiles)(exports.regionTileMap, exports.regionTileSet, exports.mapRegion.x, exports.mapRegion.y, exports.mapRegion.width + 1, exports.mapRegion.height + 1, tile_set_js_2.currentBlock === undefined ? tile_set_js_2.currentTile : undefined, tile_set_js_2.currentBlock);
            exports.mapRegion = undefined;
            (0, tile_map_js_6.setBlockSize)(1, 1);
        }
    }
    exports.SelectMapRegion = SelectMapRegion;
});
define("src/pivot", ["require", "exports", "src/point.js", "src/functions"], function (require, exports, point_js_3, functions_js_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bone = exports.Pivot = void 0;
    class Pivot extends point_js_3.Point {
        constructor() {
            super(...arguments);
            this.bones = [];
        }
        addBone(pivot2) {
            for (const bone of this.bones) {
                if (bone.pivot1 === this)
                    return;
            }
            const bone = new Bone(this, pivot2);
            this.bones.push(bone);
            pivot2.bones.push(bone);
        }
    }
    exports.Pivot = Pivot;
    class Bone {
        constructor(pivot1, pivot2) {
            this.pivot1 = pivot1;
            this.pivot2 = pivot2;
            this.pivot1 = pivot1;
            this.pivot2 = pivot2;
            this.length = (0, functions_js_12.dist)(pivot2.x - pivot1.x, pivot2.y - pivot1.y);
        }
    }
    exports.Bone = Bone;
});
define("editor/move_point", ["require", "exports", "src/system.js", "src/canvas", "src/drag", "src/pivot", "../../RuWebQuest 2/src/functions.js"], function (require, exports, system_js_16, canvas_js_11, drag_js_3, pivot_js_1, functions_js_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MovePoint extends drag_js_3.Drag {
        constructor(direction = 1) {
            super();
            this.direction = direction;
        }
        prepareObject(object) {
            this.mouseX0 = system_js_16.canvasMouse.x;
            this.mouseY0 = system_js_16.canvasMouse.y;
            this.objectX0 = object.x;
            this.objectY0 = object.y;
        }
        start() {
            this.prepareObject(this.object);
        }
        updateObject(object, x0, y0) {
            object.x = x0 + this.direction * (0, canvas_js_11.distFromScreen)(system_js_16.canvasMouse.x - this.mouseX0);
            object.y = y0 + this.direction * (0, canvas_js_11.distFromScreen)(system_js_16.canvasMouse.y - this.mouseY0);
            if (object instanceof pivot_js_1.Pivot) {
                for (const bone of object.bones) {
                    if (bone.pivot1 === object) {
                        const object2 = bone.pivot2;
                        const length = bone.length;
                        const angle = (0, functions_js_13.atan2)(object.y - object2.y, object.x - object2.x);
                        object.x = object2.x + (0, functions_js_13.cos)(angle) * length;
                        object.y = object2.y + (0, functions_js_13.sin)(angle) * length;
                        return;
                    }
                }
            }
        }
        process() {
            this.updateObject(this.object, this.objectX0, this.objectY0);
        }
    }
    exports.default = MovePoint;
});
define("editor/pan", ["require", "exports", "editor/move_point.js", "src/canvas"], function (require, exports, move_point_js_1, canvas_js_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pan = void 0;
    class Pan extends move_point_js_1.default {
        constructor() {
            super(-1);
        }
        conditions() {
            return canvas_js_12.canvasUnderCursor === canvas_js_12.currentCanvas;
        }
        start() {
            this.object = canvas_js_12.currentCanvas;
            super.start();
        }
        process() {
            super.process();
            canvas_js_12.currentCanvas.updateParameters();
        }
    }
    exports.Pan = Pan;
});
define("editor/zoom", ["require", "exports", "src/actions/action.js", "src/canvas", "src/system"], function (require, exports, action_js_2, canvas_js_13, system_js_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Zoom extends action_js_2.Action {
        constructor(zoomIn, zoomOut) {
            super();
            this.zoomIn = zoomIn;
            this.zoomOut = zoomOut;
        }
        execute() {
            if (canvas_js_13.canvasUnderCursor !== canvas_js_13.currentCanvas)
                return;
            let zoom = canvas_js_13.currentCanvas.zoom;
            if (this.zoomIn.wasPressed) {
                zoom--;
            }
            else if (this.zoomOut.wasPressed) {
                zoom++;
            }
            else {
                return;
            }
            canvas_js_13.currentCanvas.setZoomXY(zoom, system_js_17.canvasMouse.x, system_js_17.canvasMouse.y);
        }
    }
    exports.default = Zoom;
});
define("editor/move_tile_maps", ["require", "exports", "editor/move_point.js", "editor/select_tile_maps", "src/system", "editor/tile_map", "src/layer", "src/canvas", "../../RuWebQuest 2/src/functions.js", "src/pivot"], function (require, exports, move_point_js_2, select_tile_maps_js_1, system_js_18, tile_map_js_7, layer_js_4, canvas_js_14, functions_js_14, pivot_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let objects;
    class MoveTileMaps extends move_point_js_2.default {
        conditions() {
            if (tile_map_js_7.currentMode !== tile_map_js_7.mode.maps)
                return false;
            if (select_tile_maps_js_1.selectedObjects.length > 0) {
                for (const object of select_tile_maps_js_1.selectedObjects) {
                    if (object instanceof pivot_js_2.Pivot) {
                        if ((0, canvas_js_14.distToScreen)((0, functions_js_14.dist)(object.x - system_js_18.mouse.x, object.y - system_js_18.mouse.y)) <= tile_map_js_7.pivotRadius)
                            return true;
                    }
                    else if (object.collidesWithPoint(system_js_18.mouse.x, system_js_18.mouse.y)) {
                        return true;
                    }
                }
                return false;
            }
            return tile_map_js_7.objectUnderCursor !== undefined;
        }
        snapToGrid(tileMap) {
            tileMap.left = Math.round(tileMap.left);
            tileMap.top = Math.round(tileMap.top);
        }
        start() {
            objects = [];
            function addObject(object) {
                if (object instanceof layer_js_4.Layer) {
                    objects.push(...object.items);
                }
                else {
                    objects.push(object);
                }
                if (object instanceof pivot_js_2.Pivot) {
                    for (const bone of object.bones) {
                        if (bone.pivot2 !== object)
                            continue;
                        objects.push(bone.pivot1);
                    }
                }
            }
            if (select_tile_maps_js_1.selectedObjects.length > 0) {
                for (let object of select_tile_maps_js_1.selectedObjects) {
                    addObject(object);
                }
            }
            else {
                addObject(tile_map_js_7.objectUnderCursor);
            }
            this.mouseX0 = system_js_18.canvasMouse.x;
            this.mouseY0 = system_js_18.canvasMouse.y;
            this.objectX0Array = new Array(objects.length);
            this.objectY0Array = new Array(objects.length);
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                this.objectX0Array[i] = object.x;
                this.objectY0Array[i] = object.y;
            }
        }
        process() {
            for (let i = 0; i < objects.length; i++) {
                this.updateObject(objects[i], this.objectX0Array[i], this.objectY0Array[i]);
                if (this instanceof pivot_js_2.Pivot)
                    continue;
                this.snapToGrid(objects[i]);
            }
        }
    }
    exports.default = MoveTileMaps;
});
define("editor/main_window", ["require", "exports", "src/gui/window.js"], function (require, exports, window_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mainWindow = void 0;
    exports.mainWindow = new window_js_2.Win("main");
});
define("editor/keys", ["require", "exports", "src/key.js"], function (require, exports, key_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadCategoryKey = exports.moveCategoryKey = exports.copyCategoryKey = exports.newFrameKey = exports.newBlockKey = exports.toggleVisibilityKey = exports.delPropertiesKey = exports.selectTilePropertiesKey = exports.zoomOutTileSetKey = exports.zoomInTileSetKey = exports.panTileSetKey = exports.delTileSetKey = exports.selectTileKey = exports.ungroupKey = exports.groupKey = exports.pipetteKey = exports.rectangleModeKey = exports.decrementBrushSizeKey = exports.incrementBrushSizeKey = exports.changeBrushTypeKey = exports.deleteObjectKey = exports.copyObjectKey = exports.renameObjectKey = exports.newLinkKey = exports.newPivotKey = exports.newMapKey = exports.zoomOutKey = exports.zoomInKey = exports.panKey = exports.delKey = exports.selectKey = exports.autoTilingEditorKey = exports.tileSetPropertiesKey = exports.switchModeKey = exports.cancelKey = exports.loadKey = exports.saveKey = void 0;
    exports.saveKey = new key_js_3.Key("KeyS");
    exports.loadKey = new key_js_3.Key("KeyL");
    exports.cancelKey = new key_js_3.Key("Escape");
    exports.switchModeKey = new key_js_3.Key("Space");
    exports.tileSetPropertiesKey = new key_js_3.Key("KeyI");
    exports.autoTilingEditorKey = new key_js_3.Key("KeyA");
    // map mode
    exports.selectKey = new key_js_3.Key("LMB");
    exports.delKey = new key_js_3.Key("Delete");
    exports.panKey = new key_js_3.Key("ControlLeft", "MMB");
    exports.zoomInKey = new key_js_3.Key("WheelUp");
    exports.zoomOutKey = new key_js_3.Key("WheelDown");
    exports.newMapKey = new key_js_3.Key("KeyN");
    exports.newPivotKey = new key_js_3.Key("KeyP");
    exports.newLinkKey = new key_js_3.Key("KeyK");
    exports.renameObjectKey = new key_js_3.Key("KeyR");
    exports.copyObjectKey = new key_js_3.Key("KeyC");
    exports.deleteObjectKey = new key_js_3.Key("Delete");
    // tile mode
    exports.changeBrushTypeKey = new key_js_3.Key("KeyB");
    exports.incrementBrushSizeKey = new key_js_3.Key("NumpadAdd");
    exports.decrementBrushSizeKey = new key_js_3.Key("NumpadSubtract");
    exports.rectangleModeKey = new key_js_3.Key("KeyR");
    exports.pipetteKey = new key_js_3.Key("KeyP");
    exports.groupKey = new key_js_3.Key("KeyG");
    exports.ungroupKey = new key_js_3.Key("KeyU");
    // tile set
    exports.selectTileKey = new key_js_3.Key("LMB");
    exports.delTileSetKey = new key_js_3.Key("Delete");
    exports.panTileSetKey = new key_js_3.Key("ControlLeft", "MMB");
    exports.zoomInTileSetKey = new key_js_3.Key("WheelUp");
    exports.zoomOutTileSetKey = new key_js_3.Key("WheelDown");
    // tile set properties key
    exports.selectTilePropertiesKey = new key_js_3.Key("LMB");
    exports.delPropertiesKey = new key_js_3.Key("Delete");
    exports.toggleVisibilityKey = new key_js_3.Key("KeyV");
    exports.newBlockKey = new key_js_3.Key("KeyB");
    exports.newFrameKey = new key_js_3.Key("KeyF");
    // tile set auto tiling
    exports.copyCategoryKey = new key_js_3.Key("KeyC");
    exports.moveCategoryKey = new key_js_3.Key("KeyM");
    exports.loadCategoryKey = new key_js_3.Key("KeyL");
});
define("editor/settings", ["require", "exports", "../../RuWebQuest 2/src/functions.js"], function (require, exports, functions_js_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settings = void 0;
    exports.settings = {
        tileSet: {
            block: {
                color: "lightgreen",
                lineWidth: 2,
                padding: 2,
                outline: {
                    color: "green",
                    lineWidth: 4,
                }
            },
            frame: {
                color: "red",
                lineWidth: 2,
                padding: 2,
                outline: {
                    color: "darkred",
                    lineWidth: 4,
                }
            },
            visibility: {
                type: "x",
                color: "white",
                lineWidth: 3,
                size: 5,
                outline: {
                    color: "black",
                    lineWidth: 5,
                    size: 6,
                }
            },
            rule: {
                color: "black",
                lineWidth: 1,
                padding: 6,
                outline: {
                    color: "white",
                    lineWidth: 2,
                }
            },
        },
        pivot: {
            type: "o",
            color: "white",
            size: 4,
            diameter: 7,
            outline: {
                color: "black",
                size: 7,
            },
            arrow: {
                lineWidth: 2,
                pointerLength: 9,
                angle: (0, functions_js_15.rad)(150),
            }
        }
    };
});
define("editor/tile_map", ["require", "exports", "src/system.js", "src/project", "editor/create_tile_map", "src/names", "src/canvas", "editor/select_tile_maps", "editor/tile_set", "editor/new_map", "src/sprite", "editor/select_map_region", "src/block", "editor/pan", "editor/zoom", "editor/move_tile_maps", "src/auto_tiling", "editor/main_window", "../../RuWebQuest 2/src/functions.js", "editor/keys", "src/tile_map", "editor/input", "src/layer", "editor/draw", "src/pivot", "editor/settings"], function (require, exports, system_js_19, project_js_11, create_tile_map_js_2, names_js_4, canvas_js_15, select_tile_maps_js_2, tile_set_js_3, new_map_js_1, sprite_js_4, select_map_region_js_1, block_js_4, pan_js_1, zoom_js_1, move_tile_maps_js_1, auto_tiling_js_2, main_window_js_1, functions_js_16, keys_js_1, tile_map_js_8, input_js_6, layer_js_5, draw_js_2, pivot_js_3, settings_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pivotRadius = exports.brushType = exports.brushSize = exports.brush = exports.rectangleMode = exports.mapsCanvas = exports.currentMode = exports.mode = exports.selectedPivot = exports.currentTileSprite = exports.objectUnderCursor = exports.currentTileMap = void 0;
    exports.setBlockSize = setBlockSize;
    exports.tileModeOperations = tileModeOperations;
    exports.mapModeOperations = mapModeOperations;
    exports.checkObjectsWindowCollisions = checkObjectsWindowCollisions;
    exports.setTiles = setTiles;
    exports.mode = {
        tiles: Symbol("tiles"),
        maps: Symbol("maps"),
    };
    exports.currentMode = exports.mode.maps;
    exports.mapsCanvas = main_window_js_1.mainWindow.addCanvas("map", 30, 14);
    exports.mapsCanvas.background = "rgb(9, 44, 84)";
    exports.mapsCanvas.setZoom(-19);
    exports.mapsCanvas.add(new pan_js_1.Pan(), keys_js_1.panKey);
    exports.mapsCanvas.add(new zoom_js_1.default(keys_js_1.zoomInKey, keys_js_1.zoomOutKey));
    exports.mapsCanvas.add(new select_tile_maps_js_2.SelectTileMaps(), keys_js_1.selectKey);
    exports.mapsCanvas.add(new move_tile_maps_js_1.default(), keys_js_1.selectKey);
    exports.mapsCanvas.add(new select_map_region_js_1.SelectMapRegion(), keys_js_1.selectKey);
    exports.mapsCanvas.render = () => {
        for (let object of project_js_11.world.items) {
            object.draw();
            if (object instanceof pivot_js_3.Pivot) {
                const x = (0, canvas_js_15.xToScreen)(object.x);
                const y = (0, canvas_js_15.yToScreen)(object.y);
                (0, draw_js_2.drawShape)(x, y, settings_js_1.settings.pivot);
                if (select_tile_maps_js_2.selectedObjects.includes(object) || exports.objectUnderCursor === object) {
                    (0, draw_js_2.drawDashedRegion)(x - 6, y - 6, 12, 12, true);
                }
                for (const bone of object.bones) {
                    if (bone.pivot1 !== object)
                        continue;
                    (0, draw_js_2.drawArrow)((0, canvas_js_15.xToScreen)(bone.pivot1.x), (0, canvas_js_15.yToScreen)(bone.pivot1.y), (0, canvas_js_15.xToScreen)(bone.pivot2.x), (0, canvas_js_15.yToScreen)(bone.pivot2.y), settings_js_1.settings.pivot.arrow);
                }
            }
            let name = (0, names_js_4.getName)(object);
            canvas_js_15.ctx.fillStyle = "white";
            canvas_js_15.ctx.font = `${(0, canvas_js_15.distToScreen)(1)}px serif`;
            // noinspection JSCheckFunctionSignatures
            let metrics = canvas_js_15.ctx.measureText(name);
            // noinspection JSCheckFunctionSignatures
            if (object instanceof layer_js_5.Layer)
                object = object.items[0];
            canvas_js_15.ctx.fillText(name, (0, canvas_js_15.xToScreen)(object.x) - 0.5 * metrics.width, (0, canvas_js_15.yToScreen)(object.top) - 0.5 * metrics.actualBoundingBoxDescent - 4);
        }
        if (exports.currentMode === exports.mode.tiles) {
            if (select_map_region_js_1.mapRegion !== undefined && select_map_region_js_1.regionTileMap !== undefined) {
                let cellWidth = select_map_region_js_1.regionTileMap.cellWidth;
                let cellHeight = select_map_region_js_1.regionTileMap.cellHeight;
                (0, draw_js_2.drawDashedRegion)((0, canvas_js_15.xToScreen)(select_map_region_js_1.regionTileMap.left + select_map_region_js_1.mapRegion.x * cellWidth), (0, canvas_js_15.yToScreen)(select_map_region_js_1.regionTileMap.top + select_map_region_js_1.mapRegion.y * cellHeight), (0, canvas_js_15.distToScreen)((select_map_region_js_1.mapRegion.width + 1) * cellWidth), (0, canvas_js_15.distToScreen)((select_map_region_js_1.mapRegion.height + 1) * cellHeight));
            }
            else if (exports.currentTileSprite !== undefined) {
                exports.currentTileSprite.drawDashedRegion(tile_set_js_3.currentBlock === undefined && exports.brushType === exports.brush.circle);
            }
        }
        else if (exports.currentMode === exports.mode.maps) {
            if (select_tile_maps_js_2.mapSelectionRegion !== undefined) {
                select_tile_maps_js_2.mapSelectionRegion.drawDashedRegion();
            }
            else if (select_tile_maps_js_2.selectedObjects.length > 0) {
                for (let map of select_tile_maps_js_2.selectedObjects) {
                    map.drawDashedRegion();
                }
            }
            else if (exports.objectUnderCursor !== undefined) {
                exports.objectUnderCursor.drawDashedRegion();
            }
            if (exports.selectedPivot !== undefined) {
                (0, draw_js_2.drawArrow)((0, canvas_js_15.xToScreen)(exports.selectedPivot.x), (0, canvas_js_15.yToScreen)(exports.selectedPivot.y), system_js_19.canvasMouse.x, system_js_19.canvasMouse.y, settings_js_1.settings.pivot.arrow);
            }
        }
    };
    exports.mapsCanvas.update = () => {
        if (keys_js_1.switchModeKey.wasPressed) {
            exports.currentMode = exports.currentMode === exports.mode.tiles ? exports.mode.maps : exports.mode.tiles;
        }
        if (canvas_js_15.canvasUnderCursor !== exports.mapsCanvas)
            return;
        (0, canvas_js_15.setCanvas)(exports.mapsCanvas);
        checkObjectsWindowCollisions();
        if (exports.currentMode === exports.mode.tiles) {
            if (keys_js_1.rectangleModeKey.wasPressed) {
                exports.rectangleMode = !exports.rectangleMode;
                (0, tile_set_js_3.updateBlockSize)();
            }
            if (exports.currentTileMap === undefined)
                return;
            tileModeOperations();
        }
        else if (exports.currentMode === exports.mode.maps) {
            if (keys_js_1.newMapKey.wasPressed) {
                (0, new_map_js_1.newMap)();
            }
            if (keys_js_1.newPivotKey.wasPressed) {
                project_js_11.world.add(new pivot_js_3.Pivot(system_js_19.mouse.x, system_js_19.mouse.y));
            }
            if (keys_js_1.cancelKey.wasPressed) {
                exports.selectedPivot = undefined;
            }
            if (select_tile_maps_js_2.selectedObjects.length === 0 && exports.objectUnderCursor === undefined)
                return;
            mapModeOperations();
        }
    };
    let startTileColumn, startTileRow;
    exports.rectangleMode = false;
    exports.brush = {
        square: Symbol("square"),
        circle: Symbol("circle"),
    };
    exports.brushSize = 1, exports.brushType = exports.brush.square;
    let tileSprite = new sprite_js_4.Sprite();
    let blockWidth = exports.brushSize, blockHeight = exports.brushSize;
    function setBlockSize(width, height) {
        blockWidth = width;
        blockHeight = height;
    }
    function tileModeOperations() {
        let brushWidth = exports.currentTileMap.cellWidth * blockWidth;
        let brushHeight = exports.currentTileMap.cellWidth * blockHeight;
        let column = Math.floor(exports.currentTileMap.tileColumnByPoint(system_js_19.mouse) - 0.5 * (brushWidth - 1));
        let row = Math.floor(exports.currentTileMap.tileRowByPoint(system_js_19.mouse) - 0.5 * (brushHeight - 1));
        if (keys_js_1.selectKey.wasPressed) {
            startTileColumn = column;
            startTileRow = row;
        }
        if (keys_js_1.selectKey.isDown) {
            if (!exports.rectangleMode) {
                if (tile_set_js_3.currentBlock === undefined) {
                    setTiles(exports.currentTileMap, tile_set_js_3.currentTileSet, column, row, blockWidth, blockHeight, tile_set_js_3.currentTile, undefined, tile_set_js_3.currentGroup);
                }
                else if (tile_set_js_3.currentBlock.type === block_js_4.BlockType.block) {
                    column = Math.floor((column - startTileColumn) / blockWidth) * blockWidth + startTileColumn;
                    row = Math.floor((row - startTileRow) / blockHeight) * blockHeight + startTileRow;
                    setTiles(exports.currentTileMap, tile_set_js_3.currentTileSet, column, row, blockWidth, blockHeight, undefined, tile_set_js_3.currentBlock);
                }
            }
        }
        else if (keys_js_1.delKey.isDown) {
            setTiles(exports.currentTileMap, tile_set_js_3.currentTileSet, column, row, blockWidth, blockHeight, tile_set_js_3.currentTileSet.altTile, undefined, tile_set_js_3.altGroup);
        }
        if (keys_js_1.changeBrushTypeKey.wasPressed) {
            exports.brushType = exports.brushType === exports.brush.circle ? exports.brush.square : exports.brush.circle;
        }
        if (keys_js_1.incrementBrushSizeKey.wasPressed) {
            exports.brushSize++;
            if (tile_set_js_3.currentBlock === undefined)
                setBlockSize(exports.brushSize, exports.brushSize);
        }
        else if (keys_js_1.decrementBrushSizeKey.wasPressed && exports.brushSize > 1) {
            exports.brushSize--;
            if (tile_set_js_3.currentBlock === undefined)
                setBlockSize(exports.brushSize, exports.brushSize);
        }
        let x = exports.currentTileMap.left + exports.currentTileMap.cellWidth * column + 0.5 * brushWidth;
        let y = exports.currentTileMap.top + exports.currentTileMap.cellHeight * row + 0.5 * brushHeight;
        tileSprite.setPosition(x, y);
        tileSprite.setSize(brushWidth, brushHeight);
        exports.currentTileSprite = tileSprite;
        if (keys_js_1.pipetteKey.wasPressed && tile_set_js_3.currentTileSet !== undefined) {
            const tile = exports.currentTileMap.tileByPos(column, row);
            if (tile !== tile_map_js_8.emptyTile)
                (0, tile_set_js_3.setCurrentTile)(tile);
        }
    }
    function mapModeOperations() {
        const objects = select_tile_maps_js_2.selectedObjects.length > 0 ? select_tile_maps_js_2.selectedObjects : [exports.objectUnderCursor];
        const firstObject = objects[0];
        if (exports.objectUnderCursor instanceof pivot_js_3.Pivot) {
            if (keys_js_1.newLinkKey.wasPressed) {
                exports.selectedPivot = exports.objectUnderCursor;
            }
            if (exports.selectedPivot !== undefined && exports.selectedPivot !== exports.objectUnderCursor) {
                if (keys_js_1.selectKey.wasPressed) {
                    exports.selectedPivot.addBone(exports.objectUnderCursor);
                    exports.selectedPivot = undefined;
                }
            }
        }
        if (keys_js_1.renameObjectKey.wasPressed) {
            // noinspection JSCheckFunctionSignatures
            if (objects.length === 1) {
                (0, input_js_6.enterString)("Введите новое название объекта:", (0, names_js_4.getName)(firstObject), (name) => {
                    (0, names_js_4.setName)(firstObject, name);
                });
            }
            else {
                (0, input_js_6.enterString)("Введите постфикс объектов:", "", (postfix) => {
                    for (let object of objects) {
                        (0, names_js_4.setName)(object, (0, names_js_4.getName)(object) + postfix);
                    }
                });
            }
        }
        if (keys_js_1.copyObjectKey.wasPressed) {
            const width = firstObject instanceof layer_js_5.Layer ? firstObject.items[0].width : firstObject.width;
            for (let object of objects) {
                (0, create_tile_map_js_2.addObject)((0, names_js_4.incrementName)((0, names_js_4.getName)(object)), object.copy(1 + width, 0));
            }
        }
        function removeObjects() {
            for (let object of objects) {
                (0, functions_js_16.removeFromArray)(object, project_js_11.world.items);
                if (object instanceof layer_js_5.Layer) {
                    delete project_js_11.layer[(0, names_js_4.getName)(object)];
                }
                else {
                    delete project_js_11.tileMap[(0, names_js_4.getName)(object)];
                }
            }
        }
        if (keys_js_1.deleteObjectKey.wasPressed) {
            removeObjects();
            select_tile_maps_js_2.selectedObjects.length = 0;
        }
        function hasNoLayer() {
            for (const object of objects) {
                if (object instanceof layer_js_5.Layer)
                    return false;
            }
            return true;
        }
        if (keys_js_1.groupKey.wasPressed && objects.length > 1 && hasNoLayer()) {
            const newLayer = new layer_js_5.Layer(...objects);
            (0, names_js_4.setName)(newLayer, (0, names_js_4.getName)(firstObject));
            removeObjects();
            project_js_11.world.add(newLayer);
        }
        if (keys_js_1.ungroupKey.wasPressed) {
            for (const object of objects) {
                if (!object instanceof layer_js_5.Layer)
                    continue;
                let index = 0;
                for (const item of object.items) {
                    project_js_11.world.add(item);
                    (0, names_js_4.setName)(item, (0, names_js_4.getName)(exports.objectUnderCursor) + index);
                    index++;
                }
                project_js_11.world.remove(object);
            }
        }
    }
    exports.pivotRadius = 11;
    function findObject(items) {
        for (let object of items) {
            if (object instanceof pivot_js_3.Pivot) {
                if ((0, canvas_js_15.distToScreen)((0, functions_js_16.dist)(object.x - system_js_19.mouse.x, object.y - system_js_19.mouse.y)) <= settings_js_1.settings.pivot.diameter) {
                    exports.objectUnderCursor = object;
                    continue;
                }
            }
            if (!object.collidesWithPoint(system_js_19.mouse.x, system_js_19.mouse.y))
                continue;
            if (object instanceof layer_js_5.Layer) {
                findObject(object.items);
                exports.objectUnderCursor = object;
                return;
            }
            else {
                exports.objectUnderCursor = object;
                if (tile_set_js_3.currentTileSet === object.tileSet || exports.currentMode === exports.mode.maps) {
                    exports.currentTileMap = object;
                }
            }
        }
    }
    function checkObjectsWindowCollisions() {
        exports.currentTileMap = undefined;
        exports.objectUnderCursor = undefined;
        exports.currentTileSprite = undefined;
        findObject(project_js_11.world.items);
    }
    function setTiles(map, set, column, row, width, height, tileNum, block, group = []) {
        if (block !== undefined && block.type === block_js_4.BlockType.frame) {
            if (block.width < 3)
                width = block.width;
            if (block.height < 3)
                height = block.height;
        }
        for (let y = 0; y < height; y++) {
            let yy = row + y;
            if (yy < 0 || yy >= map.rows)
                continue;
            for (let x = 0; x < width; x++) {
                let xx = column + x;
                if (xx < 0 || xx >= map.columns)
                    continue;
                if (tileNum !== undefined) {
                    if (exports.brushType === exports.brush.circle) {
                        let dx = x - 0.5 * (width - 1);
                        let dy = y - 0.5 * (height - 1);
                        if (Math.sqrt(dx * dx + dy * dy) > 0.5 * width)
                            continue;
                    }
                    map.setTileByPos(xx, yy, group === undefined ? tileNum : group[(0, functions_js_16.rndi)(0, group.length)]);
                }
                else if (block.type === block_js_4.BlockType.block) {
                    map.setTileByPos(xx, yy, block.x + (x % block.width)
                        + set.columns * (block.y + (y % block.height)));
                }
                else if (block.type === block_js_4.BlockType.frame) {
                    let dx = block.width < 3 || x === 0 ? x : (x === blockWidth - 1 ? 2 : 1);
                    let dy = block.height < 3 || y === 0 ? y : (y === blockHeight - 1 ? 2 : 1);
                    map.setTileByPos(xx, yy, block.x + dx + set.columns * (block.y + dy));
                }
            }
        }
        for (let y = -1; y <= height; y++) {
            let yy = row + y;
            if (yy < 0 || yy >= map.rows)
                continue;
            for (let x = -1; x <= width; x++) {
                let xx = column + x;
                if (xx < 0 || xx >= map.columns)
                    continue;
                (0, auto_tiling_js_2.enframeTile)(map, xx, yy);
            }
        }
    }
});
define("editor/tile_zoom", ["require", "exports", "src/actions/action.js", "src/canvas"], function (require, exports, action_js_3, canvas_js_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tilesPerRow = void 0;
    exports.setTilesPerRow = setTilesPerRow;
    exports.tilesPerRow = 8;
    class TileZoom extends action_js_3.Action {
        constructor(zoomIn, zoomOut) {
            super();
            this.zoomIn = zoomIn;
            this.zoomOut = zoomOut;
        }
        execute() {
            if (canvas_js_16.canvasUnderCursor !== canvas_js_16.currentCanvas)
                return;
            if (this.zoomIn.wasPressed && exports.tilesPerRow > 1) {
                exports.tilesPerRow--;
            }
            else if (this.zoomOut.wasPressed) {
                exports.tilesPerRow++;
            }
        }
    }
    exports.default = TileZoom;
    function setTilesPerRow(value) {
        exports.tilesPerRow = value;
    }
});
define("editor/tile_pan", ["require", "exports", "src/drag.js", "src/system", "editor/tile_set", "../../RuWebQuest 2/src/functions.js", "src/canvas"], function (require, exports, drag_js_4, system_js_20, tile_set_js_4, functions_js_17, canvas_js_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TilePan = exports.y0 = void 0;
    exports.updateY0 = updateY0;
    exports.y0 = 0;
    class TilePan extends drag_js_4.Drag {
        conditions() {
            return canvas_js_17.canvasUnderCursor === canvas_js_17.currentCanvas;
        }
        start() {
            this.startingY = system_js_20.canvasMouse.y + exports.y0;
        }
        process() {
            exports.y0 = this.startingY - system_js_20.canvasMouse.y;
            updateY0();
        }
    }
    exports.TilePan = TilePan;
    function updateY0() {
        exports.y0 = (0, functions_js_17.clamp)(exports.y0, 0, tile_set_js_4.maxY0);
    }
});
define("editor/tile_set", ["require", "exports", "src/project.js", "src/canvas", "src/collisions", "src/system", "editor/tile_map", "src/tile_set", "src/block", "editor/tile_zoom", "editor/tile_pan", "editor/main_window", "editor/keys", "../../RuWebQuest 2/src/functions.js", "editor/draw"], function (require, exports, project_js_12, canvas_js_18, collisions_js_3, system_js_21, tile_map_js_9, tile_set_js_5, block_js_5, tile_zoom_js_1, tile_pan_js_1, main_window_js_2, keys_js_2, functions_js_18, draw_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxY0 = exports.altGroup = exports.currentGroup = exports.currentBlock = exports.currentTileSet = exports.currentTile = void 0;
    exports.setCurrentTile = setCurrentTile;
    exports.calculateTilesPerRow = calculateTilesPerRow;
    exports.updateBlockSize = updateBlockSize;
    exports.currentTile = 1;
    exports.maxY0 = 0;
    let tileSetCanvas = main_window_js_2.mainWindow.addCanvas("tiles", 8, 14);
    tileSetCanvas.add(new tile_pan_js_1.TilePan(), keys_js_2.panTileSetKey);
    tileSetCanvas.add(new tile_zoom_js_1.default(keys_js_2.zoomInTileSetKey, keys_js_2.zoomOutTileSetKey));
    function setCurrentTile(tile) {
        exports.currentTile = tile;
    }
    function processTiles(tileFunction, blockFunction) {
        let quantity = 0;
        for (const set of Object.values(project_js_12.tileSet)) {
            quantity += set.images.quantity;
        }
        let size = tileSetCanvas.viewport.width / tile_zoom_js_1.tilesPerRow;
        let x, y;
        let pos = -1;
        function incrementPos() {
            pos++;
            x = size * (pos % tile_zoom_js_1.tilesPerRow);
            y = size * Math.floor(pos / tile_zoom_js_1.tilesPerRow) - tile_pan_js_1.y0;
        }
        for (const set of Object.values(project_js_12.tileSet)) {
            let images = set.images;
            for (let i = 0; i < images.quantity; i++) {
                if (set.visibility[i] !== tile_set_js_5.Visibility.visible)
                    continue;
                incrementPos();
                tileFunction(set, images, i, x, y, size);
            }
            let texture = images.texture;
            for (let block of set.blocks) {
                incrementPos();
                let cellWidth = texture.width / images.columns;
                let cellHeight = texture.height / images.rows;
                let tx = block.x * cellWidth;
                let ty = block.y * cellHeight;
                let tWidth = block.width * cellWidth;
                let tHeight = block.height * cellHeight;
                blockFunction(set, block, texture, tx, ty, tWidth, tHeight, x, y, size);
            }
        }
        exports.maxY0 = Math.max(y + size - tileSetCanvas.viewport.height + tile_pan_js_1.y0, 0);
        (0, tile_pan_js_1.updateY0)();
        return pos;
    }
    function calculateTilesPerRow() {
        const quantity = processTiles(() => { }, () => { }) + 1;
        (0, tile_zoom_js_1.setTilesPerRow)((0, functions_js_18.ceil)((0, functions_js_18.sqrt)(quantity / tileSetCanvas.viewport.height * tileSetCanvas.viewport.width)));
    }
    tileSetCanvas.render = () => {
        processTiles((set, images, i, x, y, size) => {
            images.image(i).drawResized(x, y, size, size);
            if (set !== exports.currentTileSet)
                return;
            if (exports.currentTile === i) {
                (0, draw_js_3.drawDashedRegion)(x + 1, y + 1, size - 2, size - 2);
            }
            if (set.altTile === i) {
                (0, draw_js_3.drawDashedRegion)(x + 3, y + 3, size - 6, size - 6);
            }
        }, (set, block, texture, tx, ty, tWidth, tHeight, x, y, size) => {
            let width0 = tWidth >= tHeight ? size : size * tWidth / tHeight;
            let height0 = tWidth >= tHeight ? size * tHeight / tWidth : size;
            let x0 = x + 0.5 * (size - width0);
            let y0 = y + 0.5 * (size - height0);
            canvas_js_18.ctx.drawImage(texture, tx, ty, tWidth, tHeight, x0, y0, width0, height0);
            if (set === exports.currentTileSet && exports.currentBlock === block) {
                (0, draw_js_3.drawDashedRegion)(x, y, size, size);
            }
        });
    };
    function findGroup(set, tileNum) {
        for (let group of set.groups) {
            if (group[0] !== tileNum)
                continue;
            return group;
        }
        return undefined;
    }
    function updateBlockSize() {
        if (exports.currentBlock === undefined) {
            (0, tile_map_js_9.setBlockSize)(tile_map_js_9.brushSize, tile_map_js_9.brushSize);
        }
        else if (exports.currentBlock.type === block_js_5.BlockType.block) {
            (0, tile_map_js_9.setBlockSize)(exports.currentBlock.width, exports.currentBlock.height);
        }
        else if (exports.currentBlock.type === block_js_5.BlockType.frame) {
            (0, tile_map_js_9.setBlockSize)(1, 1);
        }
    }
    tileSetCanvas.update = () => {
        if (canvas_js_18.canvasUnderCursor !== tileSetCanvas)
            return;
        processTiles((set, images, i, x, y, size) => {
            if ((keys_js_2.selectTileKey.wasPressed || keys_js_2.delTileSetKey.wasPressed) && (0, collisions_js_3.pointWithParamBoxCollision)(system_js_21.canvasMouse, x, y, size, size)) {
                if (keys_js_2.selectTileKey.wasPressed) {
                    exports.currentTile = i;
                    exports.currentBlock = undefined;
                    updateBlockSize();
                    exports.currentTileSet = set;
                    exports.currentGroup = findGroup(set, exports.currentTile);
                }
                else if (keys_js_2.delTileSetKey.wasPressed) {
                    set.altTile = set.altTile === i ? -1 : i;
                    exports.altGroup = findGroup(set, set.altTile);
                    updateBlockSize();
                }
            }
        }, (set, block, texture, tx, ty, tWidth, tHeight, x, y, size) => {
            if (keys_js_2.selectTileKey.wasPressed && (0, collisions_js_3.pointWithParamBoxCollision)(system_js_21.canvasMouse, x, y, size, size)) {
                exports.currentBlock = block;
                exports.currentTile = -1;
                exports.currentTileSet = set;
                updateBlockSize();
            }
        });
    };
});
define("editor/select_tile_set_region", ["require", "exports", "editor/main.js", "src/system", "src/drag", "src/region", "editor/tile_set", "src/canvas", "../../RuWebQuest 2/src/functions.js"], function (require, exports, main_js_1, system_js_22, drag_js_5, region_js_2, tile_set_js_6, canvas_js_19, functions_js_19) {
    "use strict";
    var _SelectTileSetRegion_x, _SelectTileSetRegion_y;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tileSetRegion = void 0;
    exports.resetRegionSelector = resetRegionSelector;
    function resetRegionSelector() {
        exports.tileSetRegion = undefined;
    }
    class SelectTileSetRegion extends drag_js_5.Drag {
        constructor() {
            super(...arguments);
            _SelectTileSetRegion_x.set(this, void 0);
            _SelectTileSetRegion_y.set(this, void 0);
        }
        conditions() {
            return canvas_js_19.canvasUnderCursor === canvas_js_19.currentCanvas;
        }
        start() {
            __classPrivateFieldSet(this, _SelectTileSetRegion_x, (0, functions_js_19.floor)(system_js_22.canvasMouse.x / main_js_1.tileWidth), "f");
            __classPrivateFieldSet(this, _SelectTileSetRegion_y, (0, functions_js_19.floor)(system_js_22.canvasMouse.y / main_js_1.tileHeight), "f");
            exports.tileSetRegion = new region_js_2.Region(tile_set_js_6.currentTileSet.images.columns);
        }
        get width() {
            return (0, functions_js_19.floor)(system_js_22.canvasMouse.x / main_js_1.tileWidth) - __classPrivateFieldGet(this, _SelectTileSetRegion_x, "f");
        }
        get height() {
            return (0, functions_js_19.floor)(system_js_22.canvasMouse.y / main_js_1.tileHeight) - __classPrivateFieldGet(this, _SelectTileSetRegion_y, "f");
        }
        process() {
            if (exports.tileSetRegion === undefined)
                return;
            exports.tileSetRegion.modify(tile_set_js_6.currentTileSet.images.columns, __classPrivateFieldGet(this, _SelectTileSetRegion_x, "f"), __classPrivateFieldGet(this, _SelectTileSetRegion_y, "f"), this.width, this.height);
        }
        end() {
            if (this.width === 0 && this.height === 0) {
                exports.tileSetRegion = undefined;
            }
        }
    }
    _SelectTileSetRegion_x = new WeakMap(), _SelectTileSetRegion_y = new WeakMap();
    exports.default = SelectTileSetRegion;
});
define("editor/image_array_properties", ["require", "exports", "src/gui/window.js", "editor/tile_set_properties", "src/system", "src/canvas", "editor/draw"], function (require, exports, window_js_3, tile_set_properties_js_1, system_js_23, canvas_js_20, draw_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.imageArrayCanvas = exports.imageArrayPropertiesWindow = void 0;
    exports.updateTexturesList = updateTexturesList;
    exports.imageArrayPropertiesWindow = new window_js_3.Win("image_array_window");
    exports.imageArrayCanvas = exports.imageArrayPropertiesWindow.addCanvas("image_array", 9, 16);
    function updateTexturesList() {
        imageComboBox.innerText = "";
        for (const [name, tex] of Object.entries(system_js_23.texture)) {
            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            option["texture"] = tex;
            if (tile_set_properties_js_1.currentImageArray.texture === system_js_23.texture)
                option.selected = true;
            imageComboBox.append(option);
        }
    }
    exports.imageArrayCanvas.render = () => {
        (0, tile_set_properties_js_1.renderTileSetCanvas)(100, 100, false);
        const canvasWidth = canvas_js_20.ctx.canvas.width;
        const canvasHeight = canvas_js_20.ctx.canvas.height;
        const tWidth = canvasWidth / newColumns;
        const tHeight = canvasHeight / newRows;
        for (let i = 0; i <= newColumns; i++) {
            const x = i * tWidth;
            (0, draw_js_4.drawLine)(x, 0, x, canvasHeight);
        }
        for (let i = 0; i <= newRows; i++) {
            const y = i * tHeight;
            (0, draw_js_4.drawLine)(0, y, canvasWidth, y);
        }
    };
    let newColumns, newRows;
    const columnsField = (0, system_js_23.element)("image_array_columns");
    const rowsField = (0, system_js_23.element)("image_array_rows");
    const imageComboBox = (0, system_js_23.element)("images");
    exports.imageArrayPropertiesWindow.init = () => {
        updateTexturesList();
        columnsField.value = newColumns = tile_set_properties_js_1.currentImageArray.columns;
        rowsField.value = newRows = tile_set_properties_js_1.currentImageArray.rows;
    };
    imageComboBox.onchange = (event) => {
        tile_set_properties_js_1.currentImageArray.texture = event.target[event.target].selectedIndex["texture"];
    };
    columnsField.addEventListener("change", (event) => {
        newColumns = parseInt(columnsField.value);
    });
    rowsField.addEventListener("change", (event) => {
        newRows = parseInt(rowsField.value);
    });
    exports.imageArrayPropertiesWindow.onClose = () => {
        if (newColumns !== tile_set_properties_js_1.currentImageArray.rows || newRows !== tile_set_properties_js_1.currentImageArray.rows) {
            tile_set_properties_js_1.currentImageArray.init(newColumns, newRows);
        }
    };
});
define("editor/tile_set_properties", ["require", "exports", "src/canvas.js", "editor/select_tile_set_region", "src/system", "editor/draw", "editor/tile_set", "src/tile_set", "editor/main", "src/gui/window", "editor/keys", "src/project", "editor/input", "editor/settings", "editor/image_array_properties", "src/block"], function (require, exports, canvas_js_21, select_tile_set_region_js_1, system_js_24, draw_js_5, tile_set_js_7, tile_set_js_8, main_js_2, window_js_4, keys_js_3, project_js_13, input_js_7, settings_js_2, image_array_properties_js_1, block_js_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.currentImageArray = exports.blocksCanvas = exports.tileSetPropertiesWindow = void 0;
    exports.updateImageArraysList = updateImageArraysList;
    exports.renderTileSetCanvas = renderTileSetCanvas;
    exports.tileSetPropertiesWindow = new window_js_4.Win("tile_set_window");
    exports.blocksCanvas = exports.tileSetPropertiesWindow.addCanvas("tile_set_blocks", 9, 16);
    exports.blocksCanvas.add(new select_tile_set_region_js_1.default(), keys_js_3.selectTilePropertiesKey);
    const imageArrayComboBox = (0, system_js_24.element)("image_arrays");
    function updateImageArraysList() {
        imageArrayComboBox.innerText = "";
        for (const [name, array] of Object.entries(project_js_13.imageArray)) {
            const option = document.createElement("option");
            imageArrayComboBox.append(option);
            option.value = name;
            option.innerText = name;
            option["array"] = array;
            if (tile_set_js_7.currentTileSet.images === array)
                option.selected = true;
        }
    }
    function renderTileSetCanvas(dWidth, dHeight, selection = true) {
        let images = tile_set_js_7.currentTileSet.images;
        let tex = images.texture;
        let scale = Math.min((document.body.offsetWidth - dWidth) / tex.width, (document.body.offsetHeight - dHeight) / tex.height, 2);
        let style = canvas_js_21.currentCanvas.node.style;
        let canvasWidth = tex.width * scale;
        let canvasHeight = tex.height * scale;
        style.width = canvasWidth + "px";
        style.height = canvasHeight + "px";
        canvas_js_21.ctx.canvas.width = canvasWidth;
        canvas_js_21.ctx.canvas.height = canvasHeight;
        canvas_js_21.ctx.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, canvasWidth, canvasHeight);
        (0, main_js_2.setTileSize)(canvasWidth / images.columns, canvasHeight / images.rows);
        if (canvas_js_21.canvasUnderCursor !== canvas_js_21.currentCanvas || !selection)
            return;
        (0, draw_js_5.drawDashedRegion)(Math.floor(system_js_24.canvasMouse.x / main_js_2.tileWidth) * main_js_2.tileWidth + 3, Math.floor(system_js_24.canvasMouse.y / main_js_2.tileHeight) * main_js_2.tileHeight + 3, main_js_2.tileWidth - 7, main_js_2.tileHeight - 7);
    }
    exports.blocksCanvas.render = () => {
        renderTileSetCanvas(100, 100);
        for (let y = 0; y < tile_set_js_7.currentTileSet.rows; y++) {
            for (let x = 0; x < tile_set_js_7.currentTileSet.columns; x++) {
                let n = x + y * tile_set_js_7.currentTileSet.columns;
                if (tile_set_js_7.currentTileSet.visibility[n] !== tile_set_js_8.Visibility.hidden)
                    continue;
                (0, draw_js_5.drawShape)((x + 0.5) * main_js_2.tileWidth, (y + 0.5) * main_js_2.tileHeight, settings_js_2.settings.tileSet.visibility);
            }
        }
        for (let block of tile_set_js_7.currentTileSet.blocks) {
            let innerColor, outerColor;
            if (block.type === block_js_6.BlockType.block) {
                innerColor = "lightgreen";
                outerColor = "green";
            }
            else if (block.type === block_js_6.BlockType.frame) {
                innerColor = "red";
                outerColor = "darkred";
            }
            (0, draw_js_5.drawRect)(block.x * main_js_2.tileWidth, block.y * main_js_2.tileHeight, block.width * main_js_2.tileWidth, block.height * main_js_2.tileHeight, block.type === block_js_6.BlockType.block ? settings_js_2.settings.tileSet.block : settings_js_2.settings.tileSet.frame);
        }
        if (select_tile_set_region_js_1.tileSetRegion === undefined)
            return;
        (0, draw_js_5.drawDashedRegion)(select_tile_set_region_js_1.tileSetRegion.x * main_js_2.tileWidth, select_tile_set_region_js_1.tileSetRegion.y * main_js_2.tileHeight, (select_tile_set_region_js_1.tileSetRegion.width + 1) * main_js_2.tileWidth, (select_tile_set_region_js_1.tileSetRegion.height + 1) * main_js_2.tileHeight);
    };
    exports.blocksCanvas.update = () => {
        const x = Math.floor(system_js_24.canvasMouse.x / main_js_2.tileWidth);
        const y = Math.floor(system_js_24.canvasMouse.y / main_js_2.tileHeight);
        if (keys_js_3.delPropertiesKey.wasPressed) {
            tile_set_js_7.currentTileSet.removeBlock(x, y);
        }
        if (keys_js_3.toggleVisibilityKey.wasPressed) {
            if (select_tile_set_region_js_1.tileSetRegion === undefined) {
                let tileNum = x + y * tile_set_js_7.currentTileSet.columns;
                const vis = tile_set_js_7.currentTileSet.visibility[tileNum];
                if (vis === tile_set_js_8.Visibility.block)
                    return;
                tile_set_js_7.currentTileSet.visibility[tileNum] = vis === tile_set_js_8.Visibility.visible ? tile_set_js_8.Visibility.hidden : tile_set_js_8.Visibility.visible;
            }
            else {
                let hide;
                select_tile_set_region_js_1.tileSetRegion.process((tileNum) => {
                    let vis = tile_set_js_7.currentTileSet.visibility[tileNum];
                    if (vis === tile_set_js_8.Visibility.block)
                        return;
                    if (hide === undefined)
                        hide = vis === tile_set_js_8.Visibility.visible ? tile_set_js_8.Visibility.hidden : tile_set_js_8.Visibility.visible;
                    tile_set_js_7.currentTileSet.visibility[tileNum] = hide;
                });
            }
        }
        if (select_tile_set_region_js_1.tileSetRegion === undefined)
            return;
        if (keys_js_3.newBlockKey.wasPressed) {
            tile_set_js_7.currentTileSet.addRegion(select_tile_set_region_js_1.tileSetRegion, block_js_6.BlockType.block);
        }
        else if (keys_js_3.newFrameKey.wasPressed) {
            tile_set_js_7.currentTileSet.addRegion(select_tile_set_region_js_1.tileSetRegion, block_js_6.BlockType.frame);
        }
    };
    const newImageArray = (0, system_js_24.element)("new_image_array");
    const editImageArray = (0, system_js_24.element)("edit_image_array");
    const deleteImageArray = (0, system_js_24.element)("delete_image_array");
    imageArrayComboBox.onchange = (event) => {
        const target = event.target;
        tile_set_js_7.currentTileSet.images = target[target.selectedIndex]["array"];
    };
    newImageArray.onclick = () => {
        (0, input_js_7.enterString)("Введите название нового массива изображений:", "", (string) => {
            //const array = new ImageArray()
        });
    };
    editImageArray.onclick = () => {
        exports.currentImageArray = tile_set_js_7.currentTileSet.images;
        image_array_properties_js_1.imageArrayPropertiesWindow.open();
    };
});
define("editor/loader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readText = readText;
    function readText(func) {
        const readFile = function (e) {
            let file = e.target.files[0];
            if (!file)
                return;
            let reader = new FileReader();
            reader.onload = func;
            reader.readAsText(file);
        };
        const fileInput = document.createElement("input");
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.onchange = readFile;
        document.body.appendChild(fileInput);
        fileInput.click();
    }
});
define("editor/main", ["require", "exports", "editor/main_window.js", "src/project", "src/gui/window", "src/names", "editor/new_map", "src/drag", "src/save_load", "editor/tile_set", "editor/select_tile_set_region", "editor/tile_set_properties", "editor/auto_tiling", "editor/keys", "src/tile_map", "editor/tile_map", "../../RuWebQuest 2/src/functions.js", "src/canvas", "editor/loader"], function (require, exports, main_window_js_3, project_js_14, window_js_5, names_js_5, new_map_js_2, drag_js_6, save_load_js_5, tile_set_js_9, select_tile_set_region_js_2, tile_set_properties_js_2, auto_tiling_js_3, keys_js_4, tile_map_js_10, tile_map_js_11, functions_js_20, canvas_js_22, loader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tileHeight = exports.tileWidth = void 0;
    exports.setTileSize = setTileSize;
    exports.showAll = showAll;
    function setTileSize(width, height) {
        exports.tileWidth = width;
        exports.tileHeight = height;
    }
    function showAll() {
        let x0, y0, x1, y1;
        project_js_14.world.processSprites((sprite) => {
            if (x0 === undefined || sprite.left < x0)
                x0 = sprite.left;
            if (y0 === undefined || sprite.top < y0)
                y0 = sprite.top;
            if (x1 === undefined || sprite.right > x1)
                x1 = sprite.right;
            if (y1 === undefined || sprite.bottom > y1)
                y1 = sprite.bottom;
        });
        tile_map_js_11.mapsCanvas.setPosition(0.5 * (x0 + x1), 0.5 * (y0 + y1));
        tile_map_js_11.mapsCanvas.setZoom(Math.log((0, functions_js_20.max)((x1 - x0) / tile_map_js_11.mapsCanvas.viewport.width, (y1 - y0) / tile_map_js_11.mapsCanvas.viewport.height)) / Math.log(canvas_js_22.zk) * 0.95);
    }
    function initNames() {
        for (const [name, object] of Object.entries(project_js_14.imageArray)) {
            (0, names_js_5.setName)(object, name);
        }
        for (const [name, object] of Object.entries(project_js_14.tileSet)) {
            (0, names_js_5.setName)(object, name);
        }
        for (const [name, object] of Object.entries(project_js_14.tileMap)) {
            (0, names_js_5.setName)(object, name);
        }
        for (const [name, object] of Object.entries(project_js_14.layer)) {
            (0, names_js_5.setName)(object, name);
        }
    }
    project_js_14.project.renderNode = () => {
        main_window_js_3.mainWindow.renderNode();
        if (window_js_5.currentWindow === undefined || window_js_5.currentWindow === main_window_js_3.mainWindow)
            return;
        window_js_5.currentWindow.renderNode();
    };
    project_js_14.project.updateNode = () => {
        project_js_14.project.update();
        if (window_js_5.currentWindow === undefined) {
            main_window_js_3.mainWindow.updateNode();
        }
        else {
            window_js_5.currentWindow.updateNode();
            if (keys_js_4.cancelKey.wasPressed) {
                (0, window_js_5.hideWindow)();
                (0, drag_js_6.deleteCurrentDrag)();
            }
        }
    };
    project_js_14.project.init = () => {
        initNames();
        (0, new_map_js_2.initTileSetSelectionWindow)();
        (0, tile_map_js_10.setBorderVisibility)(true);
        for (let item of document.getElementsByClassName("cancel")) {
            item.onclick = () => {
                (0, window_js_5.hideWindow)();
                (0, drag_js_6.deleteCurrentDrag)();
            };
        }
    };
    main_window_js_3.mainWindow.update = () => {
        if (keys_js_4.loadKey.wasPressed) {
            (0, loader_js_1.readText)(function (e) {
                (0, project_js_14.initData)();
                const text = e.target.result;
                (0, save_load_js_5.loadTextures)(text, () => {
                    (0, save_load_js_5.projectFromText)(text);
                    initNames();
                    showAll();
                    (0, tile_set_js_9.calculateTilesPerRow)();
                });
            });
        }
        if (keys_js_4.saveKey.wasPressed) {
            const electron = window["electron"];
            if (electron !== undefined) {
                electron.saveDialog('showSaveDialog', {}).then(result => {
                    if (result.canceled)
                        return;
                    electron.saveFile(result.filePath, (0, save_load_js_5.projectToText)());
                });
            }
            else {
                localStorage.setItem("project", (0, save_load_js_5.projectToText)());
            }
        }
        if (tile_set_js_9.currentTileSet === undefined)
            return;
        if (keys_js_4.tileSetPropertiesKey.wasPressed) {
            (0, select_tile_set_region_js_2.resetRegionSelector)();
            (0, tile_set_properties_js_2.updateImageArraysList)();
            tile_set_properties_js_2.tileSetPropertiesWindow.open();
        }
        if (keys_js_4.autoTilingEditorKey.wasPressed) {
            auto_tiling_js_3.rulesWindow.open();
            (0, auto_tiling_js_3.updateCategoriesList)();
        }
    };
});
define("editor/auto_tiling", ["require", "exports", "editor/tile_set.js", "editor/main", "editor/tile_set_properties", "src/canvas", "src/system", "src/gui/window", "src/auto_tiling", "src/key", "../../RuWebQuest 2/src/functions.js", "editor/loader", "src/parser", "editor/keys", "editor/input", "editor/draw", "editor/settings"], function (require, exports, tile_set_js_10, main_js_3, tile_set_properties_js_3, canvas_js_23, system_js_25, window_js_6, auto_tiling_js_4, key_js_4, functions_js_21, loader_js_2, parser_js_4, keys_js_5, input_js_8, draw_js_6, settings_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rulesWindow = void 0;
    exports.updateCategoriesList = updateCategoriesList;
    let currentCategory, currentRule;
    let selectKey = new key_js_4.Key("LMB");
    exports.rulesWindow = new window_js_6.Win("rules_window");
    let tileSetCanvas = exports.rulesWindow.addCanvas("tile_set_rules", 9, 16);
    let rulesGridCanvas = exports.rulesWindow.addCanvas("rules_grid", 9, 16);
    let rulesListCanvas = exports.rulesWindow.addCanvas("rules_list", 9, 16);
    let addCategory = (0, system_js_25.element)("add_category");
    let removeCategory = (0, system_js_25.element)("remove_category");
    let renameCategory = (0, system_js_25.element)("rename_category");
    let saveCategory = (0, system_js_25.element)("save_category");
    let categoriesBox = (0, system_js_25.element)("category");
    let addRule = (0, system_js_25.element)("add_rule");
    let removeRule = (0, system_js_25.element)("remove_rule");
    let moveRuleLeft = (0, system_js_25.element)("move_rule_left");
    let moveRuleRight = (0, system_js_25.element)("move_rule_right");
    rulesListCanvas.viewport.width = rulesListCanvas.node.offsetWidth;
    rulesListCanvas.viewport.height = rulesListCanvas.node.offsetHeight;
    categoriesBox.onchange = (event) => {
        currentCategory = event.target[event.target.value].category;
    };
    addCategory.onclick = () => {
        (0, input_js_8.enterString)("Введите имя новой категории:", "", (name) => {
            currentCategory = new auto_tiling_js_4.Category(name);
            tile_set_js_10.currentTileSet.categories.push(currentCategory);
            updateCategoriesList();
        });
    };
    removeCategory.onclick = () => {
        if (currentCategory === undefined)
            return;
        (0, input_js_8.confirm)(`Действительно удалить категорию ${currentCategory.name}?`, () => {
            let categories = tile_set_js_10.currentTileSet.categories;
            (0, functions_js_21.removeFromArray)(currentCategory, categories);
            currentCategory = categories.length > 0 ? categories[0] : undefined;
            updateCategoriesList();
        });
    };
    renameCategory.onclick = () => {
        if (currentCategory === undefined)
            return;
        (0, input_js_8.enterString)("Введите имя категории:", currentCategory.name, (name) => {
            currentCategory.name = name;
            updateCategoriesList();
        });
    };
    saveCategory.onclick = () => {
        (0, input_js_8.enterString)("Введите имя категории:", currentCategory.name, (name) => {
            let text = currentCategory.normalized(name);
            const electron = window["electron"];
            if (electron !== undefined) {
                electron.saveDialog('showSaveDialog', {
                    filters: [{ name: 'Auto tiling category', extensions: ['fatc'] }],
                }).then(result => {
                    if (result.canceled)
                        return;
                    electron.saveFile(result.filePath, text);
                });
            }
            else {
                localStorage.setItem("categories", text);
            }
        });
    };
    addRule.onclick = () => {
        if (currentCategory === undefined)
            return;
        currentRule = new auto_tiling_js_4.Rule();
        currentCategory.rules.push(currentRule);
    };
    removeRule.onclick = () => {
        if (currentRule === undefined)
            return;
        (0, functions_js_21.removeFromArray)(currentRule, currentCategory.rules);
        currentRule = undefined;
    };
    function findRule(rule) {
        for (let i = 0; i < currentCategory.rules.length; i++) {
            if (currentCategory.rules[i] === rule)
                return i;
        }
        return -1;
    }
    function moveRule(rule, di) {
        let i1 = findRule(rule);
        let i2 = i1 + di;
        let rules = currentCategory.rules;
        if (i1 < 0 || i2 < 0 || i2 >= rules.length)
            return;
        let z = rules[i1];
        rules[i1] = rules[i2];
        rules[i2] = z;
    }
    moveRuleLeft.onclick = () => {
        if (currentRule !== undefined)
            moveRule(currentRule, -1);
    };
    moveRuleRight.onclick = () => {
        if (currentRule !== undefined)
            moveRule(currentRule, 1);
    };
    function updateCategoriesList() {
        while (categoriesBox.options.length > 0) {
            // noinspection JSCheckFunctionSignatures
            categoriesBox.remove(0);
        }
        let categories = tile_set_js_10.currentTileSet.categories;
        if (!categories.includes(currentCategory) || currentCategory === undefined) {
            currentCategory = categories[0];
        }
        for (let i = 0; i < categories.length; i++) {
            let category = categories[i];
            let option = document.createElement("option");
            option["category"] = category;
            option.value = i.toString();
            option.innerHTML = category.name;
            categoriesBox.appendChild(option);
            if (category === currentCategory)
                option.selected = true;
        }
    }
    tileSetCanvas.render = () => {
        (0, tile_set_properties_js_3.renderTileSetCanvas)(300, 100);
        if (currentCategory === undefined)
            return;
        canvas_js_23.ctx.globalAlpha = 0.5;
        canvas_js_23.ctx.fillStyle = "mediumorchid";
        for (let rule of currentCategory.rules) {
            let tileNum = rule.tile;
            let x = (tileNum % tile_set_js_10.currentTileSet.columns) * main_js_3.tileWidth;
            let y = (Math.floor(tileNum / tile_set_js_10.currentTileSet.columns)) * main_js_3.tileHeight;
            canvas_js_23.ctx.fillRect(x, y, main_js_3.tileWidth, main_js_3.tileHeight);
            if (currentRule === rule) {
                (0, draw_js_6.drawDashedRegion)(x, y, main_js_3.tileWidth, main_js_3.tileHeight);
            }
        }
        canvas_js_23.ctx.globalAlpha = 1.0;
        if (currentRule === undefined)
            return;
        let tileNum = currentRule.tile;
        let x = (tileNum % tile_set_js_10.currentTileSet.columns) * main_js_3.tileWidth;
        let y = (Math.floor(tileNum / tile_set_js_10.currentTileSet.columns)) * main_js_3.tileHeight;
        (0, draw_js_6.drawDashedRegion)(x, y, main_js_3.tileWidth, main_js_3.tileHeight);
    };
    let gridSize = 2;
    rulesGridCanvas.render = () => {
        canvas_js_23.ctx.fillStyle = "white";
        canvas_js_23.ctx.fillRect(0, 0, rulesGridCanvas.viewport.width, rulesGridCanvas.viewport.height);
        let size = gridSize * 2 + 1;
        let cellSize = (rulesGridCanvas.viewport.width - 1) / size;
        canvas_js_23.ctx.strokeStyle = "black";
        for (let x = 0; x <= size; x++) {
            for (let y = 0; y <= size; y++) {
                canvas_js_23.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
        if (currentRule !== undefined) {
            for (let pos of currentRule.positions) {
                (0, draw_js_6.drawRect)((pos.dx + gridSize) * cellSize, (pos.dy + gridSize) * cellSize, cellSize, cellSize, settings_js_3.settings.tileSet.rule);
            }
            tile_set_js_10.currentTileSet.image(currentRule.tile).drawResized(gridSize * cellSize + 1, gridSize * cellSize + 1, cellSize - 1, cellSize - 1);
        }
        if (canvas_js_23.canvasUnderCursor !== rulesGridCanvas)
            return;
        (0, draw_js_6.drawDashedRegion)(Math.floor(system_js_25.canvasMouse.x / cellSize) * cellSize + 4, Math.floor(system_js_25.canvasMouse.y / cellSize) * cellSize + 4, cellSize - 6, cellSize - 6);
    };
    let rulesListTilesPerRow = 8;
    rulesListCanvas.render = () => {
        if (currentCategory === undefined)
            return;
        canvas_js_23.ctx.canvas.width = rulesListCanvas.node.offsetWidth;
        canvas_js_23.ctx.canvas.height = rulesListCanvas.node.offsetHeight;
        const viewport = rulesListCanvas.viewport;
        viewport.width = rulesListCanvas.node.offsetWidth;
        viewport.height = rulesListCanvas.node.offsetHeight;
        const rules = currentCategory.rules;
        rulesListTilesPerRow = (0, functions_js_21.ceil)((0, functions_js_21.sqrt)(rules.length / viewport.height * viewport.width));
        let size = rulesListCanvas.viewport.width / rulesListTilesPerRow;
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const x = (i % rulesListTilesPerRow) * size;
            const y = (Math.floor(i / rulesListTilesPerRow)) * size;
            tile_set_js_10.currentTileSet.image(rule.tile).drawResized(x, y, size, size);
            if (rule === currentRule) {
                (0, draw_js_6.drawDashedRegion)(x + 1, y + 1, size - 1, size - 1);
            }
        }
    };
    function findPos(dx, dy, add = true) {
        for (let pos of currentRule.positions) {
            if (pos.dx === dx && pos.dy === dy)
                return pos;
        }
        return undefined;
    }
    rulesGridCanvas.update = () => {
        if (canvas_js_23.canvasUnderCursor !== rulesGridCanvas)
            return;
        let cellSize = (rulesGridCanvas.viewport.width - 1) / (gridSize * 2 + 1);
        let dx = Math.floor(system_js_25.canvasMouse.x / cellSize) - gridSize;
        let dy = Math.floor(system_js_25.canvasMouse.y / cellSize) - gridSize;
        if (selectKey.keyWasPressed) {
            if (currentRule === undefined)
                return;
            let pos = findPos(dx, dy);
            let positions = currentRule.positions;
            if (pos === undefined) {
                positions.push(new auto_tiling_js_4.Pos(dx, dy));
            }
            else {
                (0, functions_js_21.removeFromArray)(pos, positions);
            }
        }
    };
    tileSetCanvas.update = () => {
        function getTileNum() {
            let x = Math.floor(system_js_25.canvasMouse.x / main_js_3.tileWidth);
            let y = Math.floor(system_js_25.canvasMouse.y / main_js_3.tileHeight);
            return x + y * tile_set_js_10.currentTileSet.columns;
        }
        if (canvas_js_23.canvasUnderCursor !== tileSetCanvas)
            return;
        if (keys_js_5.loadCategoryKey.wasPressed) {
            const tileNum = getTileNum();
            (0, loader_js_2.readText)((e) => {
                (0, parser_js_4.initParser)(e.target.result);
                currentCategory = (0, parser_js_4.getCategory)();
                currentCategory.convert(tile_set_js_10.currentTileSet.columns);
                currentCategory.move(tileNum);
                tile_set_js_10.currentTileSet.categories.push(currentCategory);
                updateCategoriesList();
            });
            return;
        }
        if (currentCategory !== undefined) {
            const d = getTileNum() - currentCategory.getCorner();
            if (keys_js_5.copyCategoryKey.wasPressed) {
                (0, input_js_8.enterString)("Введите имя новой категории:", currentCategory.name, (name) => {
                    currentCategory = currentCategory.copy(name, d);
                    tile_set_js_10.currentTileSet.categories.push(currentCategory);
                    updateCategoriesList();
                });
            }
            if (keys_js_5.moveCategoryKey.wasPressed) {
                currentCategory.move(d);
            }
        }
        if (!selectKey.keyWasPressed || currentRule === undefined)
            return;
        currentRule.tile = getTileNum();
    };
    rulesListCanvas.update = () => {
        if (canvas_js_23.canvasUnderCursor !== rulesListCanvas || currentCategory === undefined
            || !selectKey.keyWasPressed)
            return;
        const size = rulesListCanvas.viewport.width / rulesListTilesPerRow;
        const x = Math.floor(system_js_25.canvasMouse.x / size);
        const y = Math.floor(system_js_25.canvasMouse.y / size);
        const rules = currentCategory.rules;
        const ruleNum = x + y * rulesListTilesPerRow;
        if (ruleNum < rules.length) {
            currentRule = rules[ruleNum];
        }
    };
});
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require("fs");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}
const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
        },
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    ipcMain.handle('dialog', (event, method, params) => {
        return dialog[method](params);
    });
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
contextBridge.exposeInMainWorld('electron', {
    saveFile: (fileName, text) => {
        fs.writeFile(fileName, text, (err) => {
            if (err)
                alert(err.toString());
        });
    },
    saveDialog: (method, config) => {
        return ipcRenderer.invoke('dialog', method, config);
    }
});
define("editor/rpg", ["require", "exports", "src/tile_set.js", "src/tile_map", "src/image_array", "src/project", "src/block", "src/auto_tiling", "src/system"], function (require, exports, tile_set_js_11, tile_map_js_12, image_array_js_2, project_js_15, block_js_7, auto_tiling_js_5, system_js_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadData = loadData;
    project_js_15.project.texturePath = "textures/";
    project_js_15.project.textures = ["farm_floor.png", "farm_furniture.png",];
    function loadData() {
        project_js_15.imageArray["floor"] = new image_array_js_2.ImageArray(system_js_26.texture["farm_floor"], 9, 11, 0.5, 0.5, 1, 1);
        project_js_15.imageArray["furniture"] = new image_array_js_2.ImageArray(system_js_26.texture["farm_furniture"], 10, 16, 0.5, 0.5, 1, 1);
        project_js_15.tileSet["floor"] = new tile_set_js_11.TileSet(project_js_15.imageArray["floor"], [
            0, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 0,
            1, 1, 1, 1, 1, 1, 2, 2, 2,
            1, 0, 1, 1, 0, 1, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 2, 2, 2,
            1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2,
        ], [
            new block_js_7.Block(0, 8, 3, 3, 1), new block_js_7.Block(3, 8, 1, 3, 1),
            new block_js_7.Block(4, 8, 3, 3, 1), new block_js_7.Block(7, 8, 2, 3, 1),
            new block_js_7.Block(6, 3, 3, 3, 1),
        ], [
            new auto_tiling_js_5.Category("water", [
                new auto_tiling_js_5.Rule(27, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(29, [new auto_tiling_js_5.Pos(0, -1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(45, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(47, [new auto_tiling_js_5.Pos(1, 0), new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(36, [new auto_tiling_js_5.Pos(-1, 0),]),
                new auto_tiling_js_5.Rule(28, [new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(46, [new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(38, [new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(10, [new auto_tiling_js_5.Pos(1, 1),]),
                new auto_tiling_js_5.Rule(11, [new auto_tiling_js_5.Pos(-1, 1),]),
                new auto_tiling_js_5.Rule(19, [new auto_tiling_js_5.Pos(1, -1),]),
                new auto_tiling_js_5.Rule(20, [new auto_tiling_js_5.Pos(-1, -1),]),
                new auto_tiling_js_5.Rule(37, []),
                new auto_tiling_js_5.Rule(54, []),
                new auto_tiling_js_5.Rule(55, []),
                new auto_tiling_js_5.Rule(56, []),
                new auto_tiling_js_5.Rule(57, []),
                new auto_tiling_js_5.Rule(58, []),
                new auto_tiling_js_5.Rule(59, []),
                new auto_tiling_js_5.Rule(60, []),
                new auto_tiling_js_5.Rule(61, []),
                new auto_tiling_js_5.Rule(62, []),
            ], true, 9),
            new auto_tiling_js_5.Category("dirt", [
                new auto_tiling_js_5.Rule(30, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(32, [new auto_tiling_js_5.Pos(0, -1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(48, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(50, [new auto_tiling_js_5.Pos(1, 0), new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(39, [new auto_tiling_js_5.Pos(-1, 0),]),
                new auto_tiling_js_5.Rule(31, [new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(49, [new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(41, [new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(13, [new auto_tiling_js_5.Pos(1, 1),]),
                new auto_tiling_js_5.Rule(14, [new auto_tiling_js_5.Pos(-1, 1),]),
                new auto_tiling_js_5.Rule(22, [new auto_tiling_js_5.Pos(1, -1),]),
                new auto_tiling_js_5.Rule(23, [new auto_tiling_js_5.Pos(-1, -1),]),
                new auto_tiling_js_5.Rule(40, []),
            ], true, 9),
        ], 0);
        project_js_15.tileSet["furniture"] = new tile_set_js_11.TileSet(project_js_15.imageArray["furniture"], [
            0, 1, 1, 1, 2, 2, 2, 2, 2, 1,
            0, 0, 0, 0, 2, 2, 2, 2, 2, 1,
            0, 0, 0, 0, 2, 2, 2, 2, 2, 0,
            0, 0, 0, 0, 2, 2, 2, 2, 2, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 2, 0,
            1, 0, 1, 1, 1, 0, 1, 1, 2, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
            2, 2, 2, 1, 2, 2, 2, 1, 0, 0,
            2, 2, 2, 2, 0, 0, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2, 0, 2, 2, 2,
            2, 1, 0, 0, 2, 2, 2, 2, 2, 2,
            0, 0, 0, 0, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        ], [
            new block_js_7.Block(4, 0, 3, 2, 0), new block_js_7.Block(7, 0, 2, 2, 0),
            new block_js_7.Block(4, 2, 3, 2, 0), new block_js_7.Block(7, 2, 2, 2, 0),
            new block_js_7.Block(0, 8, 3, 1, 0), new block_js_7.Block(4, 8, 3, 1, 0),
            new block_js_7.Block(6, 11, 1, 2, 0), new block_js_7.Block(0, 13, 2, 3, 1),
            new block_js_7.Block(2, 13, 2, 3, 1), new block_js_7.Block(7, 13, 3, 3, 1),
            new block_js_7.Block(7, 10, 3, 3, 1), new block_js_7.Block(0, 9, 1, 3, 1),
            new block_js_7.Block(8, 4, 1, 3, 1), new block_js_7.Block(4, 10, 2, 3, 0),
            new block_js_7.Block(4, 13, 2, 3, 0), new block_js_7.Block(6, 13, 1, 3, 0),
            new block_js_7.Block(1, 9, 3, 2, 1),
        ], [
            new auto_tiling_js_5.Category("fence1", [
                new auto_tiling_js_5.Rule(43, [new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(1, 0), new auto_tiling_js_5.Pos(0, -1), new auto_tiling_js_5.Pos(-1, 0),]),
                new auto_tiling_js_5.Rule(53, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, -1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(73, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(40, [new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(42, [new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(1, 0), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(50, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(52, [new auto_tiling_js_5.Pos(0, -1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(70, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(72, [new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(41, [new auto_tiling_js_5.Pos(0, 1), new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(63, [new auto_tiling_js_5.Pos(-1, 0), new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(51, [new auto_tiling_js_5.Pos(0, -1),]),
                new auto_tiling_js_5.Rule(60, [new auto_tiling_js_5.Pos(-1, 0),]),
                new auto_tiling_js_5.Rule(71, [new auto_tiling_js_5.Pos(0, 1),]),
                new auto_tiling_js_5.Rule(62, [new auto_tiling_js_5.Pos(1, 0),]),
                new auto_tiling_js_5.Rule(61, []),
            ], false, 10),
        ], -1, []);
        project_js_15.tileMap["ground"] = new tile_map_js_12.TileMap(project_js_15.tileSet["floor"], 16, 16, 8, 21, 1, 1, [
            0, 0, 0, 0, 0, 0, 0, 36, 37, 37, 37, 38, 0, 0, 0, 0,
            0, 0, 0, 0, 27, 28, 28, 20, 37, 37, 37, 38, 0, 0, 0, 0,
            0, 27, 28, 28, 20, 37, 37, 37, 37, 37, 37, 38, 0, 0, 0, 0,
            0, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37, 19, 28, 29, 0, 0,
            28, 20, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 19, 29, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 10, 47, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0, 0,
            37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 0, 0,
            46, 46, 46, 46, 46, 46, 46, 11, 37, 37, 37, 37, 37, 38, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 45, 46, 46, 46, 46, 46, 47, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
        project_js_15.tileMap["objects"] = new tile_map_js_12.TileMap(project_js_15.tileSet["furniture"], 16, 16, 8, 21, 1, 1, [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 43, 0, 0, 0, 43, 0, 0, 43, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 43, 0, 0, 0, 0, 0, 0, 0,
        ]);
    }
});
define("editor/smooth", ["require", "exports", "src/tile_set.js", "src/tile_map", "src/image_array", "src/project", "src/auto_tiling", "src/system"], function (require, exports, tile_set_js_12, tile_map_js_13, image_array_js_3, project_js_16, auto_tiling_js_6, system_js_27) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadData = loadData;
    project_js_16.project.texturePath = "textures/";
    project_js_16.project.textures = ["smooth.png"];
    function loadData() {
        project_js_16.imageArray.smooth = new image_array_js_3.ImageArray(system_js_27.texture.smooth, 6, 12, 0.5, 0.5, 1, 1);
        project_js_16.tileSet.smooth = new tile_set_js_12.TileSet(project_js_16.imageArray.smooth, [
            0, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 0,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
        ], [], [
            new auto_tiling_js_6.Category("smooth", [
                new auto_tiling_js_6.Rule(14, [new auto_tiling_js_6.Pos(-1, 1), new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(15, [new auto_tiling_js_6.Pos(-1, -1), new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(20, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(-1, -1), new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(21, [new auto_tiling_js_6.Pos(-1, 1), new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(43, [new auto_tiling_js_6.Pos(1, -1), new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(-1, 0),]),
                new auto_tiling_js_6.Rule(45, [new auto_tiling_js_6.Pos(-1, -1), new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(1, 0),]),
                new auto_tiling_js_6.Rule(52, [new auto_tiling_js_6.Pos(1, 1), new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(64, [new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(1, -1), new auto_tiling_js_6.Pos(0, 1),]),
                new auto_tiling_js_6.Rule(69, [new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(-1, 1),]),
                new auto_tiling_js_6.Rule(67, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(60, [new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(-1, -1),]),
                new auto_tiling_js_6.Rule(48, [new auto_tiling_js_6.Pos(-1, 1), new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(58, [new auto_tiling_js_6.Pos(1, -1), new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(54, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(-1, 1), new auto_tiling_js_6.Pos(-1, -1),]),
                new auto_tiling_js_6.Rule(44, [new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(-1, -1), new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(68, [new auto_tiling_js_6.Pos(1, 1), new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(-1, 1),]),
                new auto_tiling_js_6.Rule(7, [new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 0),]),
                new auto_tiling_js_6.Rule(28, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(10, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, 1),]),
                new auto_tiling_js_6.Rule(25, [new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(1, 0),]),
                new auto_tiling_js_6.Rule(12, [new auto_tiling_js_6.Pos(1, 1), new auto_tiling_js_6.Pos(1, 0),]),
                new auto_tiling_js_6.Rule(18, [new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(2, [new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(3, [new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(-1, 1),]),
                new auto_tiling_js_6.Rule(17, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(-1, 1),]),
                new auto_tiling_js_6.Rule(23, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(-1, -1),]),
                new auto_tiling_js_6.Rule(32, [new auto_tiling_js_6.Pos(0, -1), new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(33, [new auto_tiling_js_6.Pos(-1, -1), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(49, [new auto_tiling_js_6.Pos(-1, -1),]),
                new auto_tiling_js_6.Rule(51, [new auto_tiling_js_6.Pos(1, -1),]),
                new auto_tiling_js_6.Rule(61, [new auto_tiling_js_6.Pos(-1, 1),]),
                new auto_tiling_js_6.Rule(63, [new auto_tiling_js_6.Pos(1, 1),]),
                new auto_tiling_js_6.Rule(0, []),
            ], true, 6),
            new auto_tiling_js_6.Category("grass", [
                new auto_tiling_js_6.Rule(19, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, 1),]),
                new auto_tiling_js_6.Rule(13, [new auto_tiling_js_6.Pos(-1, 0), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(16, [new auto_tiling_js_6.Pos(1, 0), new auto_tiling_js_6.Pos(0, -1),]),
                new auto_tiling_js_6.Rule(22, [new auto_tiling_js_6.Pos(0, 1), new auto_tiling_js_6.Pos(1, 0),]),
                new auto_tiling_js_6.Rule(47, []),
            ], false, 6),
        ], 0, []);
        project_js_16.tileMap["smooth"] = new tile_map_js_13.TileMap(project_js_16.tileSet["smooth"], 32, 32, 34, 4, 1, 1, [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]);
    }
});
define("examples/IBall2/main", ["require", "exports", "src/project.js", "src/image_array", "src/system", "src/key", "src/sprite", "src/layer", "src/tile_set", "src/canvas", "src/vector_shape", "src/tile_map"], function (require, exports, project_js_17, image_array_js_4, system_js_28, key_js_5, sprite_js_5, layer_js_6, tile_set_js_13, canvas_js_24, vector_shape_js_6, tile_map_js_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    project_js_17.project.textures = ["tiles.png", "screens/02.png"];
    let gravity = 10;
    let jumpdy = -9.1;
    let horizontalAcceleration = 20;
    let maxHorizontalAcceleration = 5;
    let panelSpeed = 3;
    let emptyTile = 0;
    let keyTile = 42;
    let playerTile = 1;
    let diamondTile = 64;
    let panelTile = 241;
    let bombTile = 57;
    let figureTile = 51;
    project_js_17.project.init = () => {
        let left = new key_js_5.Key("KeyA");
        let right = new key_js_5.Key("KeyD");
        let jump = new key_js_5.Key("KeyW");
        //let tileMap = tileMapFromImage(texture.levels, texture.tiles, 16, 16, 16, 0, 0, 1, 1)
        let tileSet = new tile_set_js_13.TileSet(new image_array_js_4.ImageArray(system_js_28.texture["tiles"], 16, 21));
        tileSet.setCollision(new sprite_js_5.Sprite(undefined, 0.5, 0.5, 1.0, 1.0, vector_shape_js_6.ShapeType.box), 2);
        tileSet.setCollisionFromArray(new sprite_js_5.Sprite(undefined, 0.5, 0.5, 1.0, 1.0, vector_shape_js_6.ShapeType.circle), [keyTile, diamondTile, bombTile, figureTile]);
        let tiles = new tile_map_js_14.TileMap(tileSet, 13, 12, 0, 0, 1, 1);
        tiles.setArray([0, 0, 0, 42, 0, 0, 0, 0, 0, 98, 99, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 98, 115, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 114, 99, 0, 0, 1, 0, 0, 0, 0, 64, 0, 241, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 98, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 114, 99, 0, 0, 0, 0, 0, 100, 0, 0, 0,
            114, 99, 98, 115, 0, 0, 0, 0, 0, 116, 0, 0, 0, 98, 115, 114, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 98, 99, 114, 115, 57, 0, 0, 0, 0, 51, 0, 100, 101, 114, 99,
            98, 115, 100, 101, 0, 0, 0, 100, 0, 116, 117, 98, 115, 114, 99, 116, 117, 0, 0, 0, 116]);
        //tileMap.array = [0,96,97,0,0,0,0,0,0,0,96,97,0,41,112,113,0,0,0,0,0,0,0,112,113,65,257,257,257,257,0,0,0,0,0,257,257,257,257,0,0,0,0,257,0,0,0,257,0,0,0,0,0,1,0,0,0,330,330,330,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,257,257,257,257,257,0,0,0,0,0,0,257,257,87,0,0,0,87,257,257,0,0,0,0,0,87,0,0,0,0,0,87,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,17]
        let player = tiles.extractVectorTile(playerTile, vector_shape_js_6.ShapeType.circle);
        player.dx = 0;
        player.dy = 0;
        player.size = 0.99;
        (0, system_js_28.defaultCanvas)(16, 16);
        canvas_js_24.currentCanvas.background = "blue";
        function onGround() {
            if (player.dy < 0) {
                player.dy = 0;
                return;
            }
            player.dy = 0;
            if (jump.keyIsDown) {
                player.dy = jumpdy;
            }
        }
        function tileCollision(shape, tileNum, x, y) {
            switch (tileNum) {
                case keyTile:
                case bombTile:
                case figureTile:
                case diamondTile:
                    tiles.setTileByPos(x, y, emptyTile);
                    break;
                default:
                    player.pushFromSprite(shape);
                    break;
            }
        }
        let panels = new layer_js_6.Layer();
        tiles.processTilesByPos((column, row, tileNum) => {
            if (tileNum === panelTile) {
                let panel = tiles.extractVectorTileByPos(column, row, vector_shape_js_6.ShapeType.box);
                panel.dy = -panelSpeed;
                panels.add(panel);
            }
        });
        project_js_17.project.scene.add(tiles, player, panels);
        function horizontalMovement(object, leftKey, rightKey, acceleration, maxAcceleration) {
            if (leftKey.isDown) {
                object.dx = Math.max(-maxAcceleration, player.dx - acceleration * system_js_28.apsk);
                object.flipped = false;
            }
            if (rightKey.isDown) {
                object.dx = Math.min(maxAcceleration, player.dx + acceleration * system_js_28.apsk);
                object.flipped = true;
            }
        }
        project_js_17.project.update = () => {
            player.dy += gravity * system_js_28.apsk;
            player.y += player.dy * system_js_28.apsk;
            if (!tiles.overlaps(player)) {
                onGround();
                player.limit(tiles);
            }
            tiles.collisionWithSprite(player, (shape, tileNum, x, y) => {
                tileCollision(shape, tileNum, x, y);
                onGround();
            });
            for (let panel of panels.items) {
                panel.y += panel.dy * system_js_28.apsk;
                if (!tiles.overlaps(panel)) {
                    panel.dy = -panel.dy;
                    panel.limit(tiles);
                }
                if (panel.collidesWithSprite(player)) {
                    player.pushFromSprite(panel);
                }
                tiles.collisionWithSprite(panel, (shape) => {
                    panel.pushFromSprite(shape);
                    panel.dy = -panel.dy;
                });
            }
            horizontalMovement(player, left, right, horizontalAcceleration, maxHorizontalAcceleration);
            player.x += player.dx * system_js_28.apsk;
            if (!tiles.overlaps(player)) {
                player.dx = 0;
                player.limit(tiles);
            }
            tiles.collisionWithSprite(player, (shape, tileNum, x, y) => {
                tileCollision(shape, tileNum, x, y);
                player.dx = 0;
            });
            for (let panel of panels.items) {
                if (panel.collidesWithSprite(player)) {
                    player.pushFromSprite(panel);
                    player.dx = 0;
                }
            }
        };
    };
});
define("src/variable/number", ["require", "exports", "src/function/func.js"], function (require, exports, func_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Num = void 0;
    class Num extends func_js_2.Func {
        constructor(value = 0) {
            super();
            this.value = value;
        }
        increment(amount = 1, limit = undefined) {
            this.value += amount;
            if (limit !== undefined && this.value > limit)
                this.value = limit;
        }
        decrement(amount = 1, limit = undefined) {
            this.value -= amount;
            if (limit !== undefined && this.value < limit)
                this.value = limit;
        }
        toNumber() {
            return this.value;
        }
        toString() {
            return this.value;
        }
        getString() {
            return "var(" + this.value + ")";
        }
    }
    exports.Num = Num;
});
define("src/gui/label", ["require", "exports", "src/box.js", "src/system", "src/canvas"], function (require, exports, box_js_8, system_js_29, canvas_js_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Label = void 0;
    class Label extends box_js_8.Box {
        constructor(sprite, items, fontSize = system_js_29.defaultFontSize, horizontalAlign = system_js_29.Align.center, verticalAlign = system_js_29.Align.center, format = "", image = undefined, sizeMul = 1) {
            super(sprite.x, sprite.y, sprite.width, sprite.height);
            this.items = items;
            this.fontSize = fontSize;
            this.horizontalAlign = horizontalAlign;
            this.verticalAlign = verticalAlign;
            this.format = format;
            this.image = image;
            this.sizeMul = sizeMul;
            this.visible = true;
        }
        draw() {
            var _a, _b, _c;
            if (!this.visible)
                return;
            (0, system_js_29.setFontSize)(this.fontSize);
            let text = "";
            for (const item of this.items) {
                text += (typeof item === "string" ? item : item.toString());
            }
            let formatString = (_a = this.format) === null || _a === void 0 ? void 0 : _a.substring(1);
            if (this.format === undefined) {
            }
            else if (this.format.startsWith("Z")) {
                text = "0".repeat(parseInt(formatString) - text.length) + text;
            }
            else if (this.format.startsWith("R")) {
                let value = parseInt(text);
                if (value > 5) {
                    text = formatString + " x " + value;
                }
                else {
                    text = formatString.repeat(value);
                }
            }
            let x, y;
            const metrics = canvas_js_25.ctx.measureText(text);
            let width = metrics.width;
            let height = metrics.actualBoundingBoxDescent;
            if ((_b = this.format) === null || _b === void 0 ? void 0 : _b.startsWith("I")) {
                height *= 2;
                let k = height / this.image.height;
                width = this.image.width * k * Math.round(parseInt(text) / parseInt(formatString));
                width *= this.sizeMul;
                height *= this.sizeMul;
            }
            switch (this.horizontalAlign) {
                case system_js_29.Align.left:
                    x = (0, canvas_js_25.xToScreen)(this.left);
                    break;
                case system_js_29.Align.center:
                    x = (0, canvas_js_25.xToScreen)(this.x) - 0.5 * width;
                    break;
                case system_js_29.Align.right:
                    x = (0, canvas_js_25.xToScreen)(this.right) - width;
                    break;
            }
            switch (this.verticalAlign) {
                case system_js_29.Align.top:
                    y = (0, canvas_js_25.yToScreen)(this.top);
                    break;
                case system_js_29.Align.center:
                    y = (0, canvas_js_25.yToScreen)(this.y) - 0.5 * height;
                    break;
                case system_js_29.Align.bottom:
                    y = (0, canvas_js_25.yToScreen)(this.bottom) - height;
                    break;
            }
            if ((_c = this.format) === null || _c === void 0 ? void 0 : _c.startsWith("I")) {
                let value = Math.round(parseInt(text) / parseInt(formatString));
                width /= value;
                let image = this.image;
                for (let i = 0; i < value; i++) {
                    canvas_js_25.ctx.drawImage(image.texture, image.x + 1, image.y + 1, image.width, image.height, x + i * width, y, width - 1, height - 1);
                }
            }
            else {
                canvas_js_25.ctx.fillStyle = "black";
                for (let dy = -2; dy <= 2; dy += 2) {
                    for (let dx = -2; dx <= 2; dx += 2) {
                        canvas_js_25.ctx.fillText(text, x + dx, y + dy);
                    }
                }
                canvas_js_25.ctx.fillStyle = "white";
                canvas_js_25.ctx.fillText(text, x, y);
                (0, system_js_29.setFontSize)(system_js_29.defaultFontSize);
            }
        }
        show(...objects) {
            this.items = objects;
        }
    }
    exports.Label = Label;
});
define("src/constraint", ["require", "exports", "src/actions/action.js", "src/functions"], function (require, exports, action_js_4, functions_js_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Constraint = void 0;
    class Constraint extends action_js_4.Action {
        constructor(sprite, parent) {
            super();
            this.sprite = sprite;
            this.parent = parent;
            this.dAngle = sprite.angle - parent.angle;
            let dx = sprite.x - parent.x;
            let dy = sprite.y - parent.y;
            this.distance = (0, functions_js_22.sqrt)(dx * dx + dy * dy);
            this.dAngle2 = (0, functions_js_22.atan2)(dy, dx) - parent.angle;
        }
        execute() {
            let parent = this.parent;
            this.sprite.angle = parent.angle + this.dAngle;
            let angle = parent.angle + this.dAngle2;
            this.sprite.x = parent.x + this.distance * (0, functions_js_22.cos)(angle);
            this.sprite.y = parent.y + this.distance * (0, functions_js_22.sin)(angle);
        }
    }
    exports.Constraint = Constraint;
});
define("examples/asteroids/main", ["require", "exports", "src/system.js", "../../src/actions/linear_change.js", "src/project", "../../src/actions/sprite/rotate_image.js", "../../src/actions/sprite/delayed_remove.js", "src/canvas", "examples/asteroids/data", "src/key", "src/vector_shape", "../../../RuWebQuest 2/src/functions.js", "src/angular_sprite", "src/image"], function (require, exports, system_js_30, linear_change_js_1, project_js_18, rotate_image_js_1, delayed_remove_js_1, canvas_js_26, data_js_1, key_js_6, vector_shape_js_7, functions_js_23, angular_sprite_js_2, image_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Asteroid = void 0;
    exports.initUpdate = initUpdate;
    class Asteroid extends angular_sprite_js_2.AngularSprite {
    }
    exports.Asteroid = Asteroid;
    function initUpdate() {
        let left = new key_js_6.Key("ArrowLeft");
        let right = new key_js_6.Key("ArrowRight");
        let forward = new key_js_6.Key("ArrowUp");
        let newGame = new key_js_6.Key("Enter");
        let pause = new key_js_6.Key("KeyP");
        let currentState = data_js_1.state.alive;
        (0, system_js_30.loopedSound)("music", 0, 1.81, true);
        let flameSound = (0, system_js_30.loopedSound)("flame", 1.1, 1.9);
        // level
        function initLevel(num) {
            for (let i = 0; i < num; i++) {
                let asteroid = createAsteroid(data_js_1.template.asteroidType.big, (0, functions_js_23.rnd)((0, functions_js_23.rad)(360)));
                asteroid.moveToPerimeter(data_js_1.bounds);
            }
            if (data_js_1.level.value > 1)
                data_js_1.score.increment(data_js_1.levelBonus);
        }
        function reset() {
            data_js_1.lives.value = data_js_1.startingLives;
            data_js_1.score.value = 0;
            data_js_1.asteroids.clear();
            data_js_1.level.value = 0;
            nextLifeBonus = data_js_1.lifeBonus;
            currentWeapon = data_js_1.startingWeapon;
        }
        // asteroid
        function createAsteroid(type, angle = 0) {
            let asteroid = angular_sprite_js_2.AngularSprite.create(type, data_js_1.asteroids);
            asteroid.turn(angle);
            asteroid["type"] = type;
            asteroid.imageAngle = 0;
            asteroid.add(new rotate_image_js_1.RotateImage(asteroid, (0, system_js_30.num)(type["rotationSpeed"])));
            return asteroid;
        }
        function removeAsteroid(asteroid) {
            data_js_1.score.increment(asteroid.type.score);
            data_js_1.asteroids.remove(asteroid);
        }
        function onAsteroidHit(asteroid, bullet) {
            asteroid.hp -= bullet.damage;
            if (asteroid.hp <= 0)
                destroyAsteroid(asteroid, bullet.angle);
            createSingleExplosion(bullet, bullet.explosionSize, false);
            if (bullet.onHit)
                bullet.onHit();
        }
        function destroyAsteroid(asteroid, angle) {
            var _a;
            (_a = asteroid.type.pieces) === null || _a === void 0 ? void 0 : _a.forEach(piece => {
                createAsteroid(piece.type, angle + (0, functions_js_23.rad)(piece.angle)).setPositionAs(asteroid);
            });
            if (asteroid.onHit)
                asteroid.onHit();
            createExplosion(asteroid, asteroid.width);
            removeAsteroid(asteroid);
        }
        // explosion
        function createSingleExplosion(sprite, size, playSnd = true) {
            let explosion = angular_sprite_js_2.AngularSprite.create(data_js_1.template.explosion, data_js_1.explosions);
            explosion.size = size;
            explosion.setPosition(sprite.x, sprite.y);
            explosion.add(new delayed_remove_js_1.DelayedRemove(explosion, data_js_1.explosions, 1.0));
            if (playSnd)
                (0, system_js_30.play)("explosion");
        }
        function createExplosion(sprite, size, playSnd = true) {
            let times = (0, functions_js_23.rndi)(3) + size;
            createParticle(true);
            if (playSnd)
                (0, system_js_30.play)("explosion");
            function createParticle(first) {
                let angle = (0, functions_js_23.rad)((0, functions_js_23.rnd)(360));
                let length = first ? 0 : Math.sqrt((0, functions_js_23.rnd)(1));
                let particleSize = first ? size : (1 - length / 2) * size;
                let explosion = new angular_sprite_js_2.AngularSprite(new image_js_4.Img(system_js_30.texture["explosion"]), sprite.x + length * Math.cos(angle), sprite.y + length * Math.sin(angle), particleSize, particleSize, vector_shape_js_7.ShapeType.circle, (0, functions_js_23.rad)((0, functions_js_23.rnd)(360)), 0, 16);
                explosion.add(new delayed_remove_js_1.DelayedRemove(explosion, data_js_1.explosions, 1));
                data_js_1.explosions.add(explosion);
                times--;
                if (times > 0)
                    setTimeout(createParticle, 100);
            }
        }
        // ship
        function destroyShip() {
            createExplosion(data_js_1.shipSprite, 2);
            data_js_1.shipSprite.init(data_js_1.template.ship, data_js_1.shipLayer);
            data_js_1.shipLayer.hide();
            if (data_js_1.lives.value === 0) {
                data_js_1.messageLabel.show((0, system_js_30.loc)("gameOver"));
                currentState = data_js_1.state.gameOver;
                (0, system_js_30.play)("game_over");
            }
            else {
                data_js_1.messageLabel.show((0, system_js_30.loc)("pressEnter"));
                currentState = data_js_1.state.dead;
                (0, system_js_30.play)("death");
            }
        }
        // weapons
        let weapon = data_js_1.template.weapon;
        let currentWeapon = data_js_1.startingWeapon;
        // fireball
        weapon.fireball.update = function () {
            if (currentWeapon !== this || currentState !== data_js_1.state.alive)
                return;
            if (this.controller.active()) {
                let bullet = angular_sprite_js_2.AngularSprite.create(weapon.fireball.bullet);
                bullet.setPositionAs(data_js_1.gun);
                bullet.turn(data_js_1.shipSprite.angle);
                (0, system_js_30.play)("fireball");
            }
        };
        // main
        let nextLifeBonus = data_js_1.lifeBonus;
        let invTime = 0;
        let invulnerable = false;
        project_js_18.project.update = () => {
            var _a;
            if (pause.keyWasPressed) {
                (0, system_js_30.togglePause)();
                if (system_js_30.paused) {
                    data_js_1.messageLabel.show((0, system_js_30.loc)("paused"));
                }
                else {
                    data_js_1.messageLabel.show();
                }
            }
            if (system_js_30.paused)
                return;
            if (currentState === data_js_1.state.alive) {
                if (left.keyIsDown) {
                    linear_change_js_1.LinearChange.execute(data_js_1.shipSprite, "angle", -(0, functions_js_23.rad)(data_js_1.shipAngularSpeed));
                }
                if (right.keyIsDown) {
                    linear_change_js_1.LinearChange.execute(data_js_1.shipSprite, "angle", (0, functions_js_23.rad)(data_js_1.shipAngularSpeed));
                }
                if (forward.keyIsDown) {
                    linear_change_js_1.LinearChange.execute(data_js_1.shipSprite, "speed", data_js_1.shipAcceleration, 0, data_js_1.shipAccelerationLimit);
                    flameSound === null || flameSound === void 0 ? void 0 : flameSound.play();
                }
                else {
                    linear_change_js_1.LinearChange.execute(data_js_1.shipSprite, "speed", -data_js_1.shipDeceleration, 0);
                    if (!flameSound.paused)
                        flameSound.pause();
                    flameSound.currentTime = 0;
                }
                data_js_1.flameSprite.visible = forward.keyIsDown;
                if (!invulnerable) {
                    data_js_1.shipSprite.collisionWith(data_js_1.asteroids, (sprite, asteroid) => {
                        destroyShip();
                        destroyAsteroid(asteroid, 0);
                    });
                }
            }
            else if (newGame.keyWasPressed) {
                data_js_1.shipLayer.show();
                data_js_1.messageLabel.show();
                if (currentState === data_js_1.state.dead) {
                    data_js_1.lives.decrement();
                    invulnerable = true;
                    invTime = data_js_1.invulnerabilityTime;
                }
                else {
                    reset();
                }
                currentState = data_js_1.state.alive;
            }
            else {
                if (!flameSound.paused)
                    flameSound.pause();
            }
            if (data_js_1.asteroids.isEmpty) {
                data_js_1.level.increment();
                initLevel(data_js_1.level.value);
                (0, system_js_30.play)("new_level");
            }
            data_js_1.bullets.collisionWith(data_js_1.asteroids, (bullet, asteroid) => {
                onAsteroidHit(asteroid, bullet);
                data_js_1.bullets.remove(bullet);
            });
            // weapon
            for (const weapon of Object.values(data_js_1.template.weapon)) {
                (_a = weapon.update) === null || _a === void 0 ? void 0 : _a.call(weapon);
            }
            // extra life
            if (data_js_1.score.value >= nextLifeBonus) {
                data_js_1.lives.increment();
                (0, system_js_30.play)("extra_life");
                nextLifeBonus += nextLifeBonus;
            }
            // camera
            canvas_js_26.currentCanvas.setPositionAs(data_js_1.shipSprite);
            data_js_1.bounds.setPositionAs(data_js_1.shipSprite);
            data_js_1.hud.setPositionAs(data_js_1.shipSprite);
            // invulnerability
            if (invulnerable) {
                data_js_1.invulnerabilityAction.execute();
                invTime -= system_js_30.apsk;
                if (invTime <= 0)
                    invulnerable = false;
            }
        };
    }
});
define("src/function/rnd", ["require", "exports", "src/system.js", "src/function/func", "src/functions"], function (require, exports, system_js_31, func_js_3, functions_js_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rnd = void 0;
    class Rnd extends func_js_3.Func {
        constructor(from, to = undefined) {
            super();
            this.from = from;
            this.to = to;
        }
        toNumber() {
            return (0, functions_js_24.rnd)((0, system_js_31.num)(this.from), (0, system_js_31.num)(this.to));
        }
    }
    exports.Rnd = Rnd;
});
define("src/function/random_sign", ["require", "exports", "src/function/func.js", "src/functions"], function (require, exports, func_js_4, functions_js_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rnds = exports.RandomSign = void 0;
    class RandomSign extends func_js_4.Func {
        toNumber() {
            return (0, functions_js_25.randomSign)();
        }
    }
    exports.RandomSign = RandomSign;
    exports.rnds = new RandomSign();
});
define("src/function/mul", ["require", "exports", "src/system.js", "src/function/func"], function (require, exports, system_js_32, func_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Mul = void 0;
    class Mul extends func_js_5.Func {
        constructor(value1, value2) {
            super();
            this.value1 = value1;
            this.value2 = value2;
            this.value1 = value1;
            this.value2 = value2;
        }
        toNumber() {
            return (0, system_js_32.num)(this.value1) * (0, system_js_32.num)(this.value2);
        }
    }
    exports.Mul = Mul;
});
define("examples/asteroids/turbo", ["require", "exports", "src/system.js", "src/actions/action"], function (require, exports, system_js_33, action_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Turbo = void 0;
    class Turbo extends action_js_5.Action {
        constructor(key, cooldown) {
            super();
            this.key = key;
            this.cooldown = cooldown;
            this.time = 0;
        }
        active() {
            if (this.time > 0) {
                this.time -= system_js_33.apsk;
                return false;
            }
            else {
                if (!this.key.isDown)
                    return false;
                this.time = this.cooldown;
                return true;
            }
        }
    }
    exports.Turbo = Turbo;
});
define("src/function/cos", ["require", "exports", "src/function/func.js"], function (require, exports, func_js_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cos = void 0;
    class Cos extends func_js_6.Func {
        constructor(length, amplitude = 1, xshift = 0, yshift = 0) {
            super();
            this.length = length;
            this.amplitude = amplitude;
            this.xshift = xshift;
            this.yshift = yshift;
            this.time = 0;
        }
        calculate(x) {
            return this.yshift + this.amplitude * Math.cos((this.xshift + x) * 2 * Math.PI / this.length);
        }
    }
    exports.Cos = Cos;
});
define("examples/asteroids/data", ["require", "exports", "src/variable/number.js", "src/box", "src/canvas", "src/gui/label", "src/system", "src/image", "src/image_array", "src/layer", "src/key", "../../src/actions/sprite/loop_area.js", "../../src/actions/sprite/move.js", "../../src/actions/sprite/animate.js", "src/constraint", "../../src/actions/sprite/remove_if_outside.js", "src/project", "examples/asteroids/main", "src/function/rnd", "src/function/random_sign", "src/function/mul", "examples/asteroids/turbo", "src/point", "src/function/cos", "../../src/actions/sprite/animate_size.js", "../../../RuWebQuest 2/src/functions.js", "../../src/actions/sprite/blink.js", "src/angular_sprite"], function (require, exports, number_js_1, box_js_9, canvas_js_27, label_js_1, system_js_34, image_js_5, image_array_js_5, layer_js_7, key_js_7, loop_area_js_1, move_js_1, animate_js_1, constraint_js_1, remove_if_outside_js_1, project_js_19, main_js_4, rnd_js_1, random_sign_js_1, mul_js_1, turbo_js_1, point_js_4, cos_js_1, animate_size_js_1, functions_js_26, blink_js_1, angular_sprite_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.state = exports.flameSprite = exports.gun = exports.startingWeapon = exports.bounds = exports.hud = exports.messageLabel = exports.invulnerabilityAction = exports.shipSprite = exports.template = exports.explosions = exports.bonuses = exports.particles = exports.asteroids = exports.shipLayer = exports.bullets = exports.level = exports.lives = exports.score = exports.invulnerabilityTime = exports.levelBonus = exports.lifeBonus = exports.shipAngularSpeed = exports.shipAccelerationLimit = exports.shipDeceleration = exports.shipAcceleration = exports.startingLives = void 0;
    project_js_19.project.locales.en = {
        // hud
        level: "LEVEL ",
        pressEnter: "PRESS ENTER",
        gameOver: "GAME OVER",
        paused: "PAUSED",
        ammo: "AMMO: ",
        missiles: "MISSILES: ",
        // keys
        left: "Turn left",
        right: "Turn right",
        forward: "Thrust",
        fire: "Fire",
        pause: "Pause",
    };
    project_js_19.project.locales.ru = {
        level: "УРОВЕНЬ ",
        pressEnter: "НАЖМИТЕ ENTER",
        gameOver: "ИГРА ОКОНЧЕНА",
        paused: "ПАУЗА",
        ammo: "ПАТРОНЫ: ",
        missiles: "РАКЕТЫ: ",
        left: "Повернуть влево",
        right: "Повернуть вправо",
        forward: "Ускоряться",
        fire: "Стрелять",
        pause: "Пауза",
    };
    project_js_19.project.getAssets = () => {
        return {
            texture: ["textures/asteroid.png", "textures/explosion.png", "textures/fireball.png", "textures/flame.png",
                "textures/flame_particle.png", "textures/ship.png",],
            sound: ["sounds/death.mp3", "sounds/explosion.mp3", "sounds/extra_life.mp3", "sounds/fireball.mp3",
                "sounds/flame.mp3", "sounds/game_over.mp3", "sounds/music.mp3", "sounds/new_level.mp3"]
        };
    };
    // settings
    exports.startingLives = 3;
    exports.shipAcceleration = 25;
    exports.shipDeceleration = 15;
    exports.shipAccelerationLimit = 7.5;
    exports.shipAngularSpeed = 180;
    exports.lifeBonus = 25000;
    exports.levelBonus = 1000;
    exports.invulnerabilityTime = 2;
    // variables
    exports.score = new number_js_1.Num();
    exports.lives = new number_js_1.Num(exports.startingLives);
    exports.level = new number_js_1.Num();
    // layers
    exports.bullets = new layer_js_7.Layer();
    exports.shipLayer = new layer_js_7.Layer();
    exports.asteroids = new layer_js_7.Layer();
    exports.particles = new layer_js_7.Layer();
    exports.bonuses = new layer_js_7.Layer();
    exports.explosions = new layer_js_7.Layer();
    var state;
    (function (state) {
        state[state["alive"] = 0] = "alive";
        state[state["dead"] = 1] = "dead";
        state[state["gameOver"] = 2] = "gameOver";
    })(state || (exports.state = state = {}));
    project_js_19.project.init = () => {
        let fire = new key_js_7.Key("Space");
        let asteroidImages = {
            texture: "asteroid",
            columns: 8,
            rows: 4,
            widthMul: 1.5,
            heightMul: 1.5,
        };
        exports.template = {
            ship: {
                image: {
                    texture: "ship",
                    widthMul: 1.75,
                    heightMul: 1.75,
                },
                angle: 0,
                speed: 0,
            },
            explosion: {
                images: {
                    texture: "explosion",
                    rows: 4,
                    columns: 4,
                    widthMul: 2,
                    heightMul: 2,
                },
                angle: new rnd_js_1.Rnd(360),
                animationSpeed: 16
            },
            // asteroids
            asteroidType: {
                big: {
                    images: asteroidImages,
                    size: 3,
                    angle: new rnd_js_1.Rnd(-15, 15),
                    speed: new rnd_js_1.Rnd(2, 3),
                    animationSpeed: new mul_js_1.Mul(new rnd_js_1.Rnd(12, 20), random_sign_js_1.rnds),
                    rotationSpeed: new rnd_js_1.Rnd(-180, 180),
                    score: 100,
                    parameters: {
                        hp: 300,
                    }
                },
                medium: {
                    images: asteroidImages,
                    size: 2,
                    angle: new rnd_js_1.Rnd(-15, 15),
                    speed: new rnd_js_1.Rnd(2.5, 4),
                    animationSpeed: new mul_js_1.Mul(new rnd_js_1.Rnd(16, 25), random_sign_js_1.rnds),
                    rotationSpeed: new rnd_js_1.Rnd(-180, 180),
                    score: 200,
                    parameters: {
                        hp: 200,
                    }
                },
                small: {
                    images: asteroidImages,
                    size: 1,
                    angle: new rnd_js_1.Rnd(-15, 15),
                    speed: new rnd_js_1.Rnd(3, 5),
                    animationSpeed: new mul_js_1.Mul(new rnd_js_1.Rnd(20, 30), random_sign_js_1.rnds),
                    rotationSpeed: new rnd_js_1.Rnd(-180, 180),
                    score: 300,
                    parameters: {
                        hp: 100,
                    },
                },
            },
            // weapons
            weapon: {
                // fireball
                fireball: {
                    bullet: {
                        images: {
                            texture: "fireball",
                            columns: 1,
                            rows: 16,
                            xMul: 43 / 48,
                            yMul: 5.5 / 12,
                            widthMul: 5.25,
                            heightMul: 1.5,
                        },
                        size: 0.3,
                        speed: 15,
                        //angle: new Rnd(rad(-10), rad(10)),
                        animationSpeed: 16.0,
                        parameters: {
                            damage: 100,
                            explosionSize: 0.8,
                        }
                    },
                    controller: new turbo_js_1.Turbo(fire, 0.15),
                },
            },
        };
        let type = exports.template.asteroidType;
        type.big.pieces = [
            {
                type: type.medium,
                angle: 0,
            },
            {
                type: type.small,
                angle: 60,
            },
            {
                type: type.small,
                angle: -60,
            },
        ];
        type.medium.pieces = [
            {
                type: type.small,
                angle: 60,
            },
            {
                type: type.small,
                angle: -60,
            },
        ];
        type.small.pieces = [];
        // ship
        exports.shipSprite = angular_sprite_js_3.AngularSprite.create(exports.template.ship, exports.shipLayer);
        exports.invulnerabilityAction = new blink_js_1.Blink(exports.shipSprite, new cos_js_1.Cos(0.2, 0.5, 0, 0.5));
        let flameImages = new image_array_js_5.ImageArray(system_js_34.texture["flame"], 3, 3, 0.5, 1);
        exports.flameSprite = new angular_sprite_js_3.AngularSprite(flameImages.image(0), -0.6, 0, 1, 1, undefined, (0, functions_js_26.rad)(-90), 0);
        exports.shipLayer.add(exports.flameSprite);
        // weapon
        exports.startingWeapon = exports.template.weapon.fireball;
        exports.gun = new point_js_4.Point(1, 0);
        // gui
        (0, system_js_34.defaultCanvas)(16, 16);
        exports.bounds = new box_js_9.Box(0, 0, canvas_js_27.currentCanvas.width + 3, canvas_js_27.currentCanvas.height + 3);
        let hudArea = new box_js_9.Box(0, 0, canvas_js_27.currentCanvas.width - 1, canvas_js_27.currentCanvas.height - 1);
        let scoreLabel = new label_js_1.Label(hudArea, [exports.score], system_js_34.defaultFontSize, system_js_34.Align.left, system_js_34.Align.top, "Z8");
        let levelLabel = new label_js_1.Label(hudArea, [(0, system_js_34.loc)("level"), exports.level], system_js_34.defaultFontSize, system_js_34.Align.center, system_js_34.Align.top);
        let livesLabel = new label_js_1.Label(hudArea, [exports.lives], system_js_34.defaultFontSize, system_js_34.Align.right, system_js_34.Align.top, "I1", new image_js_5.Img(system_js_34.texture.ship));
        exports.messageLabel = new label_js_1.Label(hudArea, [""], system_js_34.defaultFontSize, system_js_34.Align.center, system_js_34.Align.center);
        exports.hud = new layer_js_7.Layer(scoreLabel, levelLabel, livesLabel, exports.messageLabel);
        // other
        canvas_js_27.currentCanvas.background = "rgb(9, 44, 84)";
        project_js_19.project.scene.add(exports.bullets, exports.asteroids, exports.bonuses, exports.particles, exports.shipLayer, exports.explosions, exports.hud);
        project_js_19.project.actions.push(new loop_area_js_1.LoopArea(exports.shipSprite, exports.bounds), new animate_js_1.Animate(exports.flameSprite, flameImages, 16), new animate_size_js_1.AnimateSize(exports.flameSprite, new cos_js_1.Cos(0.1, 0.1, 0, 0.95)), new constraint_js_1.Constraint(exports.flameSprite, exports.shipSprite), new constraint_js_1.Constraint(exports.gun, exports.shipSprite), new remove_if_outside_js_1.RemoveIfOutside(exports.bullets, exports.bounds), new loop_area_js_1.LoopArea(exports.asteroids, exports.bounds), new move_js_1.Move(project_js_19.project.scene));
        (0, main_js_4.initUpdate)();
    };
});
// noinspection DuplicatedCode
define("examples/breakout/data", ["require", "exports", "src/tile_set.js", "src/project", "src/image_array", "src/block", "src/auto_tiling", "src/tile_map", "src/system"], function (require, exports, tile_set_js_14, project_js_20, image_array_js_6, block_js_8, auto_tiling_js_7, tile_map_js_15, system_js_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadData = loadData;
    function loadData() {
        project_js_20.tileSet["blocks"] = new tile_set_js_14.TileSet(new image_array_js_6.ImageArray(system_js_35.texture["blocks"], 4, 14, 0.5, 0.5, 1, 1), [
            1, 1, 1, 0,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            2, 2, 2, 2,
            2, 2, 2, 2,
            2, 2, 2, 2,
            2, 2, 1, 1,
            2, 2, 2, 2,
            2, 2, 2, 2,
            2, 2, 2, 1,
            2, 2, 2, 1,
            0, 0, 0, 0,
            0, 0, 0, 1,
        ], [
            new block_js_8.Block(0, 4, 2, 1, 0), new block_js_8.Block(2, 4, 2, 1, 0),
            new block_js_8.Block(2, 5, 2, 1, 0), new block_js_8.Block(0, 5, 2, 1, 0),
            new block_js_8.Block(0, 6, 2, 1, 0), new block_js_8.Block(2, 6, 2, 1, 0),
            new block_js_8.Block(0, 7, 2, 1, 0), new block_js_8.Block(0, 8, 1, 2, 0),
            new block_js_8.Block(1, 8, 1, 2, 0), new block_js_8.Block(2, 8, 1, 2, 0),
            new block_js_8.Block(3, 8, 1, 2, 0), new block_js_8.Block(2, 10, 1, 2, 0),
            new block_js_8.Block(1, 10, 1, 2, 0), new block_js_8.Block(0, 10, 1, 2, 0),
        ], [
            new auto_tiling_js_7.Category("blocks", [
                new auto_tiling_js_7.Rule(3, [new auto_tiling_js_7.Pos(0, 1), new auto_tiling_js_7.Pos(1, 0), new auto_tiling_js_7.Pos(0, -1), new auto_tiling_js_7.Pos(-1, 0),]),
                new auto_tiling_js_7.Rule(0, [new auto_tiling_js_7.Pos(0, 1), new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(0, -1),]),
                new auto_tiling_js_7.Rule(2, [new auto_tiling_js_7.Pos(0, -1), new auto_tiling_js_7.Pos(1, 0), new auto_tiling_js_7.Pos(0, 1),]),
                new auto_tiling_js_7.Rule(7, [new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(0, -1), new auto_tiling_js_7.Pos(1, 0),]),
                new auto_tiling_js_7.Rule(15, [new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(0, 1), new auto_tiling_js_7.Pos(1, 0),]),
                new auto_tiling_js_7.Rule(1, [new auto_tiling_js_7.Pos(0, 1), new auto_tiling_js_7.Pos(0, -1),]),
                new auto_tiling_js_7.Rule(11, [new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(1, 0),]),
                new auto_tiling_js_7.Rule(4, [new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(0, -1),]),
                new auto_tiling_js_7.Rule(6, [new auto_tiling_js_7.Pos(1, 0), new auto_tiling_js_7.Pos(0, -1),]),
                new auto_tiling_js_7.Rule(12, [new auto_tiling_js_7.Pos(-1, 0), new auto_tiling_js_7.Pos(0, 1),]),
                new auto_tiling_js_7.Rule(14, [new auto_tiling_js_7.Pos(0, 1), new auto_tiling_js_7.Pos(1, 0),]),
                new auto_tiling_js_7.Rule(8, [new auto_tiling_js_7.Pos(-1, 0),]),
                new auto_tiling_js_7.Rule(5, [new auto_tiling_js_7.Pos(0, -1),]),
                new auto_tiling_js_7.Rule(10, [new auto_tiling_js_7.Pos(1, 0),]),
                new auto_tiling_js_7.Rule(13, [new auto_tiling_js_7.Pos(0, 1),]),
                new auto_tiling_js_7.Rule(9, []),
            ], false),
        ], -1, []);
        project_js_20.tileMap["blocks"] = new tile_map_js_15.TileMap(project_js_20.tileSet["blocks"], 40, 22, 0, 0, 1, 1, [
            4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 26, 27, 26, 27, 26, 27, 26, 27, 32, 32, 26, 27, 26, 27, 26, 27, 26, 27, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, 28, 29, 28, 29, 28, 29, 28, 29, 32, 36, 36, 32, 28, 29, 28, 29, 28, 29, 28, 29, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, 22, 23, 22, 23, 22, 23, 22, 23, 32, 36, 33, 33, 36, 32, 22, 23, 22, 23, 22, 23, 22, 23, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, 18, 19, 18, 19, 18, 19, 18, 19, 32, 36, 33, 37, 37, 33, 36, 32, 18, 19, 18, 19, 18, 19, 18, 19, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, 16, 17, 16, 17, 16, 17, 16, 17, 48, 36, 49, 37, 51, 51, 37, 49, 36, 48, 16, 17, 16, 17, 16, 17, 16, 17, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11,
            15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 15,
        ]);
        project_js_20.world.add(project_js_20.tileMap["blocks"]);
    }
});
define("examples/breakout/registry", ["require", "exports", "../../../RuWebQuest 2/src/functions.js"], function (require, exports, functions_js_27) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registry = void 0;
    exports.registry = {
        ball: {
            angle: (0, functions_js_27.rad)(-45),
            speed: 15,
            size: 0.75,
        },
        paddle: {
            width: 5,
            height: 1,
        }
    };
});
define("examples/breakout/pop_effect", ["require", "exports", "src/actions/action.js", "examples/breakout/main"], function (require, exports, action_js_6, main_js_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PopEffect = exports.PopEffectType = void 0;
    var PopEffectType;
    (function (PopEffectType) {
        PopEffectType[PopEffectType["disappear"] = 0] = "disappear";
        PopEffectType[PopEffectType["appear"] = 1] = "appear";
    })(PopEffectType || (exports.PopEffectType = PopEffectType = {}));
    class PopEffect extends action_js_6.Action {
        constructor(sprite, period, type) {
            super();
            this.sprite = sprite;
            this.period = period;
            this.type = type;
            this.width = sprite.width;
            this.height = sprite.height;
            this.startingTime = new Date().getTime();
        }
        draw() {
            this.sprite.draw();
        }
        update() {
            this.execute();
        }
        execute() {
            let time = (new Date().getTime() - this.startingTime) / 1000.0 / this.period;
            if (time >= 1.0) {
                main_js_5.fx.remove(this);
                this.next();
                return;
            }
            let k = this.type === PopEffectType.appear ? time : 1.0 - time;
            this.sprite.setSize(this.width * k, this.height * k);
        }
        next() {
        }
    }
    exports.PopEffect = PopEffect;
});
define("examples/breakout/main", ["require", "exports", "src/key.js", "src/project", "examples/breakout/data", "src/sprite", "src/image", "examples/breakout/registry", "src/vector_shape", "src/tile_map", "src/nine_patch", "examples/breakout/pop_effect", "src/box", "src/gui/label", "src/variable/number", "src/system", "../../../RuWebQuest 2/src/functions.js", "src/angular_sprite"], function (require, exports, key_js_8, project_js_21, data_js_2, sprite_js_6, image_js_6, registry_js_1, vector_shape_js_8, tile_map_js_16, nine_patch_js_2, pop_effect_js_1, box_js_10, label_js_2, number_js_2, system_js_36, functions_js_28, angular_sprite_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fx = exports.level = exports.initialBallY = exports.paddleY = exports.maxPaddleX = exports.minPaddleX = void 0;
    project_js_21.project.textures = ["blocks.png"];
    project_js_21.project.sounds = ["collision1.mp3", "collision2.mp3", "collision3.mp3", "collision4.mp3", "ball_lost.ogg",
        "game_over.mp3", "win.ogg"];
    exports.fx = [];
    project_js_21.project.init = () => {
        const key = new key_js_8.Key("LMB");
        (0, data_js_2.loadData)();
        (0, system_js_36.defaultCanvas)(40, 24);
        const ballImage = new image_js_6.Img(system_js_36.texture["blocks"], 3 * 32, 13 * 32, 32, 32);
        const blocksLeft = new number_js_2.Num();
        const score = new number_js_2.Num();
        const lives = new number_js_2.Num(3);
        const hud = new box_js_10.Box(0, 1, project_js_21.tileMap["blocks"].width - 3, project_js_21.tileMap["blocks"].height - 1);
        const blocksLeftLabel = new label_js_2.Label(hud, ["" /*"Blocks left: ", blocksLeft*/], system_js_36.defaultFontSize, system_js_36.Align.left, system_js_36.Align.top);
        const messageLabel = new label_js_2.Label(hud, [""], system_js_36.defaultFontSize, system_js_36.Align.center, system_js_36.Align.center);
        const scoreLabel = new label_js_2.Label(hud, [score], system_js_36.defaultFontSize, system_js_36.Align.center, system_js_36.Align.top, "Z8");
        const livesLabel = new label_js_2.Label(hud, [lives], system_js_36.defaultFontSize, system_js_36.Align.right, system_js_36.Align.top, "I1", ballImage, 0.5);
        const tileSetWidth = 4;
        // new Img(texture.blocks, 0, 192, 96, 32, 0.5, 1.0, 1.0, 0.5)
        const paddle = new angular_sprite_js_4.AngularSprite(new nine_patch_js_2.NinePatch(new image_js_6.Img(system_js_36.texture["blocks"], 0, 0, 96, 32), 16, 80, 8, 24), 0, 10.5, 5, 1, vector_shape_js_8.ShapeType.box);
        const BallStatus = {
            onPaddle: 0,
            rolling: 1,
            appearing: 2,
            gameOver: 3
        };
        const ball = new angular_sprite_js_4.AngularSprite(ballImage, 0, 9.25, 0.5, 0.5, vector_shape_js_8.ShapeType.circle);
        let ballStatus = BallStatus.onPaddle;
        project_js_21.tileSet["blocks"].setCollision(new sprite_js_6.Sprite(undefined, 0.5, 0.5, 1.0, 1.0, vector_shape_js_8.ShapeType.box), 0, tileSetWidth * 14);
        project_js_21.project.scene.add(exports.level, exports.fx, paddle, ball, blocksLeftLabel, livesLabel, messageLabel, scoreLabel);
        const horizontalBlocks = tileSetWidth * 4;
        const verticalBlocks = tileSetWidth * 8;
        const singleBlocks = tileSetWidth * 12;
        function initPaddleSize(width, height) {
            paddle.setSize(width, height);
            let d = exports.level.cellWidth + paddle.halfWidth;
            exports.minPaddleX = -exports.level.halfWidth + d;
            exports.maxPaddleX = exports.level.halfWidth - d;
            exports.paddleY = exports.level.halfHeight - paddle.halfHeight;
            exports.initialBallY = paddle.top - ball.halfHeight;
        }
        function initLevel() {
            exports.level = project_js_21.tileMap["blocks"].copy();
            ball.speed = registry_js_1.registry.ball.speed;
            ball.angle = registry_js_1.registry.ball.angle;
            ball.size = registry_js_1.registry.ball.size;
            ballStatus = BallStatus.onPaddle;
            lives.value = 3;
            score.value = 0;
            messageLabel.items[0] = "";
            project_js_21.project.scene.replace(0, exports.level);
            blocksLeft.value = 0;
            exports.level.processTilesByPos((column, row, tileNum) => {
                if (tileNum >= horizontalBlocks) {
                    blocksLeft.increment();
                }
            });
            initPaddleSize(registry_js_1.registry.paddle.width, registry_js_1.registry.paddle.height);
        }
        initLevel();
        const collisionType = {
            none: 0,
            horizontal: 1,
            vertical: 2,
        };
        project_js_21.project.update = () => {
            function removeTile(column, row, snd) {
                let tileNum = exports.level.tileByPos(column, row);
                let dx = 0, dy = 0;
                if (tileNum < horizontalBlocks) {
                    (0, system_js_36.play)(snd);
                    return;
                }
                else if (tileNum < verticalBlocks) {
                    dx = 1;
                    if (tileNum % 2 === 1) {
                        column -= 1;
                    }
                }
                else if (tileNum < singleBlocks) {
                    dy = 1;
                    if ((0, functions_js_28.floor)(tileNum / tileSetWidth) % 2 === 1) {
                        row -= 1;
                    }
                }
                blocksLeft.decrement(1 + dx + dy);
                score.increment((2 - dx - dy) * 100);
                if (blocksLeft.value <= 0) {
                    messageLabel.items[0] = "ВЫ ПОБЕДИЛИ!";
                    ballStatus = BallStatus.gameOver;
                    (0, system_js_36.play)("win");
                }
                let sprite = exports.level.tileAngularSpriteByPos(column, row);
                sprite.setPosition(sprite.x + 0.5 * dx, sprite.y + 0.5 * dy);
                sprite.setSize(1 + dx, 1 + dy);
                exports.fx.add(new pop_effect_js_1.PopEffect(sprite, 0.5, pop_effect_js_1.PopEffectType.disappear));
                exports.level.setTileByPos(column, row, tile_map_js_16.emptyTile);
                exports.level.setTileByPos(column + dx, row + dy, tile_map_js_16.emptyTile);
                (0, system_js_36.play)("collision1");
            }
            if (ballStatus !== BallStatus.gameOver) {
                paddle.setPosition((0, functions_js_28.clamp)(system_js_36.mouse.x, exports.minPaddleX, exports.maxPaddleX), exports.paddleY);
            }
            if (ballStatus === BallStatus.rolling) {
                let dx = (0, functions_js_28.cos)(ball.angle) * ball.speed * system_js_36.apsk;
                let dy = (0, functions_js_28.sin)(ball.angle) * ball.speed * system_js_36.apsk;
                let angleChanged = collisionType.none;
                ball.x += dx;
                exports.level.collisionWithSprite(ball, (collisionSprite, tileNum, x, y) => {
                    ball.pushFromSprite(collisionSprite);
                    angleChanged = collisionType.horizontal;
                    removeTile(x, y, "collision2");
                });
                ball.y += dy;
                exports.level.collisionWithSprite(ball, (collisionSprite, tileNum, x, y) => {
                    ball.pushFromSprite(collisionSprite);
                    angleChanged = collisionType.vertical;
                    removeTile(x, y, "collision4");
                });
                if (angleChanged === collisionType.horizontal) {
                    ball.angle = (0, functions_js_28.rad)(180) - ball.angle;
                }
                else if (angleChanged === collisionType.vertical) {
                    ball.angle = -ball.angle;
                }
                if ((0, functions_js_28.sin)(ball.angle) > 0 && ball.collidesWithSprite(paddle)) {
                    ball.pushFromSprite(paddle);
                    ball.angle = (0, functions_js_28.atan2)(-paddle.height, ball.x - paddle.x);
                    (0, system_js_36.play)("collision3");
                }
                if (ball.top > paddle.bottom) {
                    if (lives.value <= 0) {
                        messageLabel.items[0] = "ИГРА ОКОНЧЕНА";
                        ballStatus = BallStatus.gameOver;
                        ball.hide();
                        (0, system_js_36.play)("game_over");
                        return;
                    }
                    (0, system_js_36.play)("ball_lost");
                    lives.decrement();
                    let effect = new pop_effect_js_1.PopEffect(ball, 0.5, pop_effect_js_1.PopEffectType.appear);
                    effect.next = () => {
                        ballStatus = BallStatus.onPaddle;
                    };
                    exports.fx.add(effect);
                    ball.angle = registry_js_1.registry.ball.angle;
                    ballStatus = BallStatus.appearing;
                }
            }
            else {
                ball.setPosition(paddle.x, exports.initialBallY);
                if (ballStatus === BallStatus.onPaddle && key.keyWasPressed) {
                    ballStatus = BallStatus.rolling;
                }
                else if (ballStatus === BallStatus.gameOver && key.keyWasPressed) {
                    ballStatus = BallStatus.onPaddle;
                    initLevel();
                    ball.show();
                }
            }
        };
    };
});
define("examples/collision_test/main", ["require", "exports", "src/system.js", "src/sprite", "src/project", "src/vector_shape", "src/key"], function (require, exports, system_js_37, sprite_js_7, project_js_22, vector_shape_js_9, key_js_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    project_js_22.project.init = () => {
        let switchType = new key_js_9.Key("Space", "LMB", "WheelUp", "WheelDown");
        (0, system_js_37.defaultCanvas)(40, 22);
        let defaultColor = "rgb(0, 128, 0)";
        let collisionColor = "rgb(128, 255, 128)";
        let mouseColor = "rgba(255, 255, 0, 128)";
        let pushedColor = "rgba(255, 255, 0, 128)";
        let circle = new sprite_js_7.Sprite(new vector_shape_js_9.VectorShape(defaultColor), 0, -4, 2, 2, vector_shape_js_9.ShapeType.circle);
        let box = new sprite_js_7.Sprite(new vector_shape_js_9.VectorShape(defaultColor), 0, 0, 3, 2, vector_shape_js_9.ShapeType.box);
        let pill = new sprite_js_7.Sprite(new vector_shape_js_9.VectorShape(defaultColor), 0, 4, 3, 2, vector_shape_js_9.ShapeType.pill);
        let mouseShape = new sprite_js_7.Sprite(new vector_shape_js_9.VectorShape(mouseColor, 0.5), 0, 0, 1.5, 1.5, vector_shape_js_9.ShapeType.circle);
        let pushed = new sprite_js_7.Sprite(new vector_shape_js_9.VectorShape(pushedColor), 0, 0, 1.5, 1.5, vector_shape_js_9.ShapeType.circle);
        let shapeNumber = 0;
        let shapes = [circle, box, pill];
        let shapeTypes = [vector_shape_js_9.ShapeType.circle, vector_shape_js_9.ShapeType.box, vector_shape_js_9.ShapeType.pill];
        project_js_22.project.scene.add(circle, box, pill, pushed, mouseShape);
        project_js_22.project.update = () => {
            mouseShape.setPositionAs(system_js_37.mouse);
            pushed.setPositionAs(system_js_37.mouse);
            for (let shape of shapes) {
                let collision = mouseShape.collidesWithSprite(shape);
                shape.image.color = collision ? collisionColor : defaultColor;
                if (collision) {
                    pushed.pushFromSprite(shape);
                }
            }
            if (switchType.keyWasPressed) {
                shapeNumber = (shapeNumber + 1) % shapeTypes.length;
                let type = shapeTypes[shapeNumber];
                mouseShape.shapeType = type;
                pushed.shapeType = type;
                if (type === vector_shape_js_9.ShapeType.circle) {
                    // noinspection JSSuspiciousNameCombination
                    mouseShape.height = pushed.height = mouseShape.width;
                }
                else {
                    mouseShape.height = pushed.height = 2.5;
                }
            }
        };
    };
});
define("examples/salute/main", ["require", "exports", "src/project.js", "src/image", "src/system", "src/layer", "../../src/actions/sprite/remove_if_outside.js", "src/canvas", "src/function/rnd", "../../../RuWebQuest 2/src/functions.js", "src/vector_sprite", "src/vector_shape"], function (require, exports, project_js_23, image_js_7, system_js_38, layer_js_8, remove_if_outside_js_2, canvas_js_28, rnd_js_2, functions_js_29, vector_sprite_js_2, vector_shape_js_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    project_js_23.project.textures = ["particle.png"];
    const shotDX = new rnd_js_2.Rnd(0.5, 1.5);
    const shotDY = new rnd_js_2.Rnd(-19, -15);
    const shotY = 10;
    const gravity = 10;
    const dyThreshold = 5;
    const tailLength = 20, tailStep = 0.01;
    const probability = 0.02;
    const shotSize = new rnd_js_2.Rnd(0.25, 0.5);
    const particlesQuantity = new rnd_js_2.Rnd(50, 100);
    const particleSpeed = new rnd_js_2.Rnd(5, 10);
    const particleSize = new rnd_js_2.Rnd(0.25, 0.75);
    const particleColor = new rnd_js_2.Rnd(128, 255);
    const fadingSpeed = new rnd_js_2.Rnd(0.25, 0.5);
    //let particle = new Particle(image, shot.x, shot.y, size, size
    //    , length * cos(angle), length * sin(angle), fadingSpeed.toNumber(), layer.color)
    class Particle extends vector_sprite_js_2.VectorSprite {
        constructor(image, x, y, dx, dy, size, fadingSpeed, color) {
            super(image, x, y, size, size, vector_shape_js_10.ShapeType.circle, dx, dy);
            this.fadingSpeed = fadingSpeed;
            this.color = color;
        }
        draw() {
            canvas_js_28.ctx.globalAlpha = this.opacity;
            let x = (0, canvas_js_28.xToScreen)(this.x);
            let y = (0, canvas_js_28.yToScreen)(this.y);
            const gradient = canvas_js_28.ctx.createRadialGradient(x, y, 0, x, y, (0, canvas_js_28.distToScreen)(this.halfWidth));
            gradient.addColorStop(0, `rgba(${this.color},255)`);
            gradient.addColorStop(1, `rgba(${this.color},0)`);
            canvas_js_28.ctx.fillStyle = gradient;
            canvas_js_28.ctx.fillRect((0, canvas_js_28.xToScreen)(this.left), (0, canvas_js_28.yToScreen)(this.top), (0, canvas_js_28.distToScreen)(this.width), (0, canvas_js_28.distToScreen)(this.height));
            canvas_js_28.ctx.fillStyle = "white";
            canvas_js_28.ctx.globalAlpha = 1;
        }
    }
    class Particles extends layer_js_8.Layer {
        constructor() {
            super(...arguments);
            this.isShot = false;
        }
    }
    project_js_23.project.init = () => {
        let particleLayers = new layer_js_8.Layer();
        let particles = new Particles();
        particles.isShot = false;
        let image = new image_js_7.Img(system_js_38.texture["particle"], 0, 0);
        (0, system_js_38.defaultCanvas)(16, 16);
        canvas_js_28.currentCanvas.background = "rgb(9, 44, 84)";
        project_js_23.project.scene.add(particleLayers);
        particleLayers.add(particles);
        project_js_23.project.actions = [
            new remove_if_outside_js_2.RemoveIfOutside(particles, canvas_js_28.currentCanvas)
        ];
        project_js_23.project.update = () => {
            if ((0, functions_js_29.rnd)(0, 1) < probability) {
                let color = `${particleColor.toNumber()},${particleColor.toNumber()},${particleColor.toNumber()}`;
                let shots = new Particles();
                shots.isShot = true;
                shots.color = color;
                particleLayers.add(shots);
                let dx = shotDX.toNumber();
                let dy = shotDY.toNumber();
                let x = 0;
                let y = shotY;
                for (let i = 0; i < tailLength; i++) {
                    let shot = new Particle(image, x, y, dx, dy, shotSize.toNumber() * i / tailLength, fadingSpeed.toNumber(), color);
                    x += dx * tailStep;
                    y += dy * tailStep;
                    dy += tailStep * gravity;
                    shots.add(shot);
                }
            }
            for (let layer of particleLayers.items) {
                for (let shot of layer.items) {
                    shot.setPosition(shot.x + shot.dx * system_js_38.apsk, shot.y + shot.dy * system_js_38.apsk);
                    shot.dy = shot.dy + system_js_38.apsk * gravity;
                    if (shot.fadingSpeed !== undefined) {
                        shot.opacity -= shot.fadingSpeed * system_js_38.apsk;
                        if (shot.opacity < 0)
                            shot.opacity = 0;
                    }
                    if (shot.dy > dyThreshold && layer.isShot) {
                        particleLayers.remove(layer);
                        let quantity = particlesQuantity.toNumber();
                        for (let i = 0; i < quantity; i++) {
                            let size = particleSize.toNumber();
                            let angle = (0, functions_js_29.rnd)((0, functions_js_29.rad)(360));
                            let length = Math.sqrt((0, functions_js_29.rnd)(0, 1)) * particleSpeed.toNumber();
                            let particle = new Particle(image, shot.x, shot.y, size, length * (0, functions_js_29.cos)(angle), length * (0, functions_js_29.sin)(angle), fadingSpeed.toNumber(), layer.color);
                            particles.add(particle);
                        }
                    }
                }
            }
        };
    };
});
define("examples/snow/generator", ["require", "exports", "src/actions/action.js", "src/vector_shape", "../../../RuWebQuest 2/src/functions.js", "src/vector_sprite"], function (require, exports, action_js_7, vector_shape_js_11, functions_js_30, vector_sprite_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Generator extends action_js_7.Action {
        constructor(image, shape, type) {
            super();
            this.image = image;
            this.shape = shape;
            this.type = type;
        }
        execute() {
            let shape = this.shape;
            switch (this.type) {
                case vector_shape_js_11.ShapeType.box:
                    return new vector_sprite_js_3.VectorSprite(this.image, (0, functions_js_30.rnd)(shape.left, shape.right), (0, functions_js_30.rnd)(shape.top, shape.bottom));
            }
        }
    }
    exports.default = Generator;
});
define("examples/snow/main", ["require", "exports", "src/project.js", "src/layer", "../../src/actions/sprite/move.js", "src/box", "src/canvas", "../../src/actions/interval.js", "src/image", "src/system", "../../src/actions/sprite/remove_if_outside.js", "src/vector_shape", "examples/snow/generator", "../../../RuWebQuest 2/src/functions.js"], function (require, exports, project_js_24, layer_js_9, move_js_2, box_js_11, canvas_js_29, interval_js_1, image_js_8, system_js_39, remove_if_outside_js_3, vector_shape_js_12, generator_js_1, functions_js_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    project_js_24.project.textures = ["snowflake.png"];
    project_js_24.project.init = () => {
        (0, system_js_39.defaultCanvas)(16, 16);
        canvas_js_29.currentCanvas.background = "rgb(9, 44, 84)";
        let flakes = new layer_js_9.Layer();
        let generator = new generator_js_1.default(new image_js_8.Img(system_js_39.texture["snowflake"]), new box_js_11.Box(0, canvas_js_29.currentCanvas.top - 3, canvas_js_29.currentCanvas.width + 3, 2), vector_shape_js_12.ShapeType.box);
        project_js_24.project.scene.add(flakes);
        project_js_24.project.actions = [
            new move_js_2.Move(flakes),
            new remove_if_outside_js_3.RemoveIfOutside(flakes, new box_js_11.Box(0, 0, canvas_js_29.currentCanvas.width + 6, canvas_js_29.currentCanvas.height + 6)),
        ];
        let interval = new interval_js_1.Interval(0.05);
        project_js_24.project.update = () => {
            if (interval.active()) {
                let flake = generator.execute();
                flake.size = (0, functions_js_31.rnd)(0.5, 2);
                flake.dy = (0, functions_js_31.rnd)(0.5, 2);
                flakes.add(flake);
            }
        };
    };
});
define("src/tile_map_transform", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transformTileMap = transformTileMap;
    exports.turnTileMapClockwise = turnTileMapClockwise;
    exports.turnTileMapCounterclockwise = turnTileMapCounterclockwise;
    exports.mirrorTileMapHorizontally = mirrorTileMapHorizontally;
    exports.mirrorTileMapVertically = mirrorTileMapVertically;
    function transformTileMap(tileMap, centerX = 0.5 * tileMap.columns, centerY = 0.5 * tileMap.rows, mirrorHorizontally, mirrorVertically, swap) {
        centerX -= 0.5;
        centerY -= 0.5;
        let newArray = new Array(tileMap.rows * tileMap.columns).fill(-1);
        let newK = swap ? tileMap.columns : tileMap.rows;
        for (let y = 0; y < tileMap.rows; y++) {
            for (let x = 0; x < tileMap.columns; x++) {
                let newX = x - centerX;
                let newY = y - centerY;
                newX = mirrorHorizontally ? -newX : newX;
                newY = mirrorVertically ? -newY : newY;
                if (swap)
                    [newX, newY] = [newY, newX];
                newX += centerX;
                newY += centerY;
                if (newX < 0 || newX >= tileMap.columns)
                    continue;
                if (newY < 0 || newY >= tileMap.rows)
                    continue;
                newArray[newX + newK * newY] = tileMap.tileByPos(x, y);
            }
        }
        //if(swap) [tileMap.#columns, tileMap.#rows] = [tileMap.#rows, tileMap.#columns]
        tileMap.setArray(newArray);
    }
    function turnTileMapClockwise(tileMap, centerX, centerY) {
        transformTileMap(tileMap, centerX, centerY, false, true, true);
    }
    function turnTileMapCounterclockwise(tileMap, centerX, centerY) {
        transformTileMap(tileMap, centerX, centerY, true, false, true);
    }
    function mirrorTileMapHorizontally(tileMap, centerX, centerY) {
        transformTileMap(tileMap, centerX, centerY, true, false, false);
    }
    function mirrorTileMapVertically(tileMap, centerX, centerY) {
        transformTileMap(tileMap, centerX, centerY, false, true, false);
    }
});
define("src/function/sum", ["require", "exports", "src/system.js", "src/function/func"], function (require, exports, system_js_40, func_js_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sum = void 0;
    class Sum extends func_js_7.Func {
        constructor(value1, value2) {
            super();
            this.value1 = value1;
            this.value2 = value2;
        }
        toNumber() {
            return (0, system_js_40.num)(this.value1) + (0, system_js_40.num)(this.value2);
        }
    }
    exports.Sum = Sum;
});
define("temp/actions/interval", ["require", "exports", "../system", "./action"], function (require, exports, system_1, action_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Interval = void 0;
    class Interval extends action_1.Action {
        constructor(interval) {
            super();
            this.interval = interval;
            this.time = 0;
        }
        active() {
            if (this.time > 0) {
                this.time -= system_1.apsk;
                return false;
            }
            this.time = this.interval;
            return true;
        }
    }
    exports.Interval = Interval;
});
define("temp/actions/linear_change", ["require", "exports", "../system", "./action"], function (require, exports, system_2, action_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LinearChange = void 0;
    class LinearChange extends action_2.Action {
        constructor(object, parameterName, speed, min, max) {
            super();
            this.object = object;
            this.parameterName = parameterName;
            this.speed = speed;
            this.min = min;
            this.max = max;
        }
        execute() {
            let currentSpeed = this.speed * system_2.apsk;
            let value = this.object[this.parameterName] + currentSpeed;
            if (this.max !== undefined && value > this.max) {
                value = this.max;
            }
            else if (this.min !== undefined && value < this.min) {
                value = this.min;
            }
            this.object[this.parameterName] = value;
        }
        static execute(object, parameterName, speed, min, max) {
            let currentSpeed = speed * system_2.apsk;
            let value = object[parameterName] + currentSpeed;
            if (max !== undefined && value > max) {
                value = max;
            }
            else if (min !== undefined && value < min) {
                value = min;
            }
            object[parameterName] = value;
        }
    }
    exports.LinearChange = LinearChange;
});
define("temp/actions/sprite/add_action", ["require", "exports", "../action"], function (require, exports, action_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddAction = void 0;
    class AddAction extends action_3.Action {
        constructor(sprite, action) {
            super();
            this.sprite = sprite;
            this.action = action;
        }
        execute() {
            let sprite = this.sprite.toSprite();
            sprite.actions.push(this.action.copy());
        }
    }
    exports.AddAction = AddAction;
});
define("temp/actions/sprite/animate", ["require", "exports", "../../system", "../action"], function (require, exports, system_3, action_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animate = void 0;
    class Animate extends action_4.Action {
        constructor(sprite, images, speed) {
            super();
            this.sprite = sprite;
            this.images = images;
            this.speed = speed;
            this.frame = 0.0;
        }
        execute() {
            let quantity = this.images.quantity;
            this.frame += system_3.apsk * this.speed;
            while (this.frame < 0.0) {
                this.frame += quantity;
            }
            while (this.frame > quantity) {
                this.frame -= quantity;
            }
            this.sprite.image = this.images.image(Math.floor(this.frame));
        }
    }
    exports.Animate = Animate;
});
define("temp/actions/sprite/animate_angle", ["require", "exports", "../action", "../../system"], function (require, exports, action_5, system_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnimateAngle = void 0;
    class AnimateAngle extends action_5.Action {
        constructor(object, func) {
            super();
            this.object = object;
            this.func = func;
            this.time = 0;
        }
        execute() {
            this.time += system_4.apsk;
            this.object.angle = this.func.calculate(this.time);
        }
    }
    exports.AnimateAngle = AnimateAngle;
});
define("temp/actions/sprite/animate_opacity", ["require", "exports", "../action", "../../system"], function (require, exports, action_6, system_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnimateOpacity = void 0;
    class AnimateOpacity extends action_6.Action {
        constructor(object, func) {
            super();
            this.object = object;
            this.func = func;
            this.time = 0;
        }
        execute() {
            this.time += system_5.apsk;
            this.object.opacity = this.func.calculate(this.time);
        }
    }
    exports.AnimateOpacity = AnimateOpacity;
});
define("temp/actions/sprite/animate_size", ["require", "exports", "../action", "../../system"], function (require, exports, action_7, system_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnimateSize = void 0;
    class AnimateSize extends action_7.Action {
        constructor(object, func) {
            super();
            this.object = object;
            this.func = func;
            this.time = 0;
        }
        execute() {
            this.time += system_6.apsk;
            this.object.width = this.object.height = this.func.calculate(this.time);
        }
    }
    exports.AnimateSize = AnimateSize;
});
define("temp/actions/sprite/blink", ["require", "exports", "../action", "../../system"], function (require, exports, action_8, system_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Blink = void 0;
    class Blink extends action_8.Action {
        constructor(object, func) {
            super();
            this.object = object;
            this.func = func;
            this.time = 0;
        }
        execute() {
            this.time += system_7.apsk;
            this.object.visible = this.func.calculate(this.time) >= 0.5;
        }
    }
    exports.Blink = Blink;
});
define("temp/actions/sprite/delayed_hide", ["require", "exports", "../../system", "../action"], function (require, exports, system_8, action_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DelayedHide = void 0;
    class DelayedHide extends action_9.Action {
        constructor(object, time) {
            super();
            this.object = object;
            this.time = time;
        }
        execute() {
            super.execute();
            if (this.time <= 0.0) {
                this.object.hide();
            }
            else {
                this.time -= system_8.apsk;
            }
        }
        copy() {
            return new DelayedHide(this.object.toSprite(), (0, system_8.num)(this.time));
        }
    }
    exports.DelayedHide = DelayedHide;
});
define("temp/actions/sprite/delayed_remove", ["require", "exports", "../../system", "../action"], function (require, exports, system_9, action_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DelayedRemove = void 0;
    class DelayedRemove extends action_10.Action {
        constructor(sprite, layer, time) {
            super();
            this.sprite = sprite;
            this.layer = layer;
            this.time = time;
        }
        execute() {
            super.execute();
            if (this.time <= 0.0) {
                this.layer.remove(this.sprite);
            }
            else {
                this.time -= system_9.apsk;
            }
        }
        copy() {
            return new DelayedRemove(this.sprite.toSprite(), this.layer, (0, system_9.num)(this.time));
        }
    }
    exports.DelayedRemove = DelayedRemove;
});
define("temp/actions/sprite/execute_actions", ["require", "exports", "../../layer", "../action", "../../variable/sprite"], function (require, exports, layer_1, action_11, sprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExecuteActions = void 0;
    class ExecuteActions extends action_11.Action {
        constructor(object) {
            super();
            this.object = object;
        }
        executeActions(sprite) {
            sprite_1.current.sprite = sprite;
            for (const command of sprite.actions) {
                command.execute();
            }
        }
        execute() {
            if (this.object instanceof layer_1.Layer) {
                for (const item of this.object.items) {
                    this.executeActions(item);
                }
            }
            else {
                this.executeActions(this.object.toSprite());
            }
        }
    }
    exports.ExecuteActions = ExecuteActions;
});
define("temp/actions/sprite/loop_area", ["require", "exports", "../../layer", "../action"], function (require, exports, layer_2, action_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoopArea = void 0;
    class LoopArea extends action_12.Action {
        constructor(object, area) {
            super();
            this.object = object;
            this.area = area;
        }
        execute() {
            if (this.object instanceof layer_2.Layer) {
                this.object.items.forEach(sprite => sprite.wrap(this.area));
            }
            else {
                this.object.wrap(this.area);
            }
        }
    }
    exports.LoopArea = LoopArea;
});
define("temp/actions/sprite/move", ["require", "exports", "../action"], function (require, exports, action_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Move = void 0;
    class Move extends action_13.Action {
        constructor(object) {
            super();
            this.object = object;
        }
        execute() {
            this.object.move();
        }
    }
    exports.Move = Move;
});
define("temp/actions/sprite/remove_if_outside", ["require", "exports", "../action"], function (require, exports, action_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoveIfOutside = void 0;
    class RemoveIfOutside extends action_14.Action {
        constructor(layer, bounds) {
            super();
            this.layer = layer;
            this.bounds = bounds;
        }
        execute() {
            let items = this.layer.items;
            let bounds = this.bounds;
            let i = 0;
            while (i < items.length) {
                let sprite = items[i];
                if (sprite.right < bounds.left || sprite.left > bounds.right
                    || sprite.bottom < bounds.top || sprite.top > bounds.bottom) {
                    items.splice(i, 1);
                }
                else {
                    i++;
                }
            }
        }
    }
    exports.RemoveIfOutside = RemoveIfOutside;
});
define("temp/actions/sprite/rotate_image", ["require", "exports", "../../system", "../action", "../../../../RuWebQuest 2/src/functions"], function (require, exports, system_10, action_15, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RotateImage = void 0;
    class RotateImage extends action_15.Action {
        constructor(object, speed) {
            super();
            this.object = object;
            this.speed = (0, functions_1.rad)(speed);
        }
        execute() {
            this.object.toSprite().turnImage(this.speed * system_10.apsk);
        }
        copy() {
            return new RotateImage(this.object.toSprite(), this.speed);
        }
    }
    exports.RotateImage = RotateImage;
});
define("temp/utils/tilemap_from_image", ["require", "exports", "../image_array", "../tile_map"], function (require, exports, image_array_1, tile_map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tileMapFromImage = tileMapFromImage;
    function getImageData(image, x = 0, y = 0, width, height) {
        if (width === undefined)
            width = image.width;
        if (height === undefined)
            height = image.height;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
        return { canvas: canvas, data: canvas.getContext('2d').getImageData(x, y, width, height).data };
    }
    function getPixel(data, x, y, width) {
        let offset = 4 * (x + y * width);
        let value = data[offset] + (data[offset + 1] << 8) + (data[offset + 2] << 16) + (data[offset + 3] << 24);
        return value;
    }
    function downloadCanvas(canvas) {
        const downloadImage = document.createElement("a");
        document.body.appendChild(downloadImage);
        downloadImage.setAttribute("download", "image");
        downloadImage.href = canvas.toDataURL();
        downloadImage.click();
        downloadImage.remove();
    }
    function tileMapFromImage(image, tilesImage, cellWidth, cellHeight, columns, tx, ty, twidth, theight) {
        let tiles = [];
        let tileSetColumns = tilesImage.width / cellWidth;
        let tileSetRows = tilesImage.height / cellHeight;
        for (let y = 0; y < tileSetRows; y++) {
            let yy = y * cellWidth;
            for (let x = 0; x < tileSetColumns; x++) {
                let xx = x * cellWidth;
                tiles.push(getImageData(tilesImage, xx, yy, cellWidth, cellHeight).data);
            }
        }
        let width = image.width;
        let height = image.height;
        let imageData = getImageData(image).data;
        let screenColumns = 13; //width / cellWidth
        let screenRows = 12; //height / cellHeight
        let tilemapArray = new Array(screenColumns * screenRows);
        for (let y = 0; y < screenRows; y++) {
            let yy = y * cellHeight;
            for (let x = 0; x < screenColumns; x++) {
                let found = false;
                let xx = x * cellWidth;
                main: for (let i = 0; i < tiles.length; i++) {
                    let tileData = tiles[i];
                    for (let dy = 0; dy < cellHeight; dy++) {
                        for (let dx = 0; dx < cellWidth; dx++) {
                            if (getPixel(imageData, xx + dx, yy + dy, width) !== getPixel(tileData, dx, dy, cellWidth)) {
                                continue main;
                            }
                        }
                    }
                    found = true;
                    tilemapArray[x + y * screenColumns] = i;
                    break;
                }
                if (!found) {
                    tilemapArray[x + y * screenColumns] = tiles.length;
                    tiles.push(getImageData(image, xx, yy, cellWidth, cellHeight).data);
                }
            }
        }
        console.log(`[${tilemapArray.toString()}]`);
        let rows = Math.floor((tiles.length + columns - 1) / columns);
        let canvas = document.createElement("canvas");
        canvas.width = columns * cellWidth;
        canvas.height = rows * cellHeight;
        let ctx = canvas.getContext("2d");
        let imageArray = new image_array_1.ImageArray(image, columns, rows);
        for (let i = 0; i < tiles.length; i++) {
            ctx.putImageData(new ImageData(tiles[i], cellWidth, cellHeight), cellWidth * (i % columns), cellHeight
                * Math.floor(i / columns));
            //imageArray._images[i] = Img.fromCanvas(canvas)
        }
        //downloadCanvas(canvas)
        let tileMap = new tile_map_1.TileMap(imageArray, screenColumns, screenRows, tx, ty, twidth, theight);
        tileMap.array = tilemapArray;
        return tileMap;
    }
});
define("src/main", ["require", "exports", "src/system.js", "src/sprite", "src/project", "src/vector_shape", "src/key"], function (require, exports, system_js_41, sprite_js_8, project_js_25, vector_shape_js_13, key_js_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    project_js_25.project.init = () => {
        let switchType = new key_js_10.Key("Space", "LMB", "WheelUp", "WheelDown");
        (0, system_js_41.defaultCanvas)(40, 22);
        let defaultColor = "rgb(0, 128, 0)";
        let collisionColor = "rgb(128, 255, 128)";
        let mouseColor = "rgba(255, 255, 0, 128)";
        let pushedColor = "rgba(255, 255, 0, 128)";
        let circle = new sprite_js_8.Sprite(new vector_shape_js_13.VectorShape(defaultColor), 0, -4, 2, 2, vector_shape_js_13.ShapeType.circle);
        let box = new sprite_js_8.Sprite(new vector_shape_js_13.VectorShape(defaultColor), 0, 0, 3, 2, vector_shape_js_13.ShapeType.box);
        let pill = new sprite_js_8.Sprite(new vector_shape_js_13.VectorShape(defaultColor), 0, 4, 3, 2, vector_shape_js_13.ShapeType.pill);
        let mouseShape = new sprite_js_8.Sprite(new vector_shape_js_13.VectorShape(mouseColor, 0.5), 0, 0, 1.5, 1.5, vector_shape_js_13.ShapeType.circle);
        let pushed = new sprite_js_8.Sprite(new vector_shape_js_13.VectorShape(pushedColor), 0, 0, 1.5, 1.5, vector_shape_js_13.ShapeType.circle);
        let shapeNumber = 0;
        let shapes = [circle, box, pill];
        let shapeTypes = [vector_shape_js_13.ShapeType.circle, vector_shape_js_13.ShapeType.box, vector_shape_js_13.ShapeType.pill];
        project_js_25.project.scene.add(circle, box, pill, pushed, mouseShape);
        project_js_25.project.update = () => {
            mouseShape.setPositionAs(system_js_41.mouse);
            pushed.setPositionAs(system_js_41.mouse);
            for (let shape of shapes) {
                let collision = mouseShape.collidesWithSprite(shape);
                shape.image.color = collision ? collisionColor : defaultColor;
                if (collision) {
                    pushed.pushFromSprite(shape);
                }
            }
            if (switchType.keyWasPressed) {
                shapeNumber = (shapeNumber + 1) % shapeTypes.length;
                let type = shapeTypes[shapeNumber];
                mouseShape.shapeType = type;
                pushed.shapeType = type;
                if (type === vector_shape_js_13.ShapeType.circle) {
                    // noinspection JSSuspiciousNameCombination
                    mouseShape.height = pushed.height = mouseShape.width;
                }
                else {
                    mouseShape.height = pushed.height = 2.5;
                }
            }
        };
    };
});
