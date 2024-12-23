import {TileSet} from "../src/tile_set.js"
import {TileMap} from "../src/tile_map.js"
import {ImageArray} from "../src/image_array.js"
import {imageArray, project, tileMap, tileSet} from "../src/project.js"
import {Block} from "../src/block.js"
import {Category, Pos, Rule} from "../src/auto_tiling.js"
import {texture} from "../src/system.js"

project.texturePath = "textures/"
project.textures = ["farm_floor.png", "farm_furniture.png", ]

export function loadData() {
    imageArray.floor = new ImageArray(texture.farm_floor, 9, 11, 0.5, 0.5, 1, 1)
    imageArray.furniture = new ImageArray(texture.farm_furniture, 10, 16, 0.5, 0.5, 1, 1)

    tileSet.floor = new TileSet(imageArray.floor, [
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
        new Block(0, 8, 3, 3, 1), new Block(3, 8, 1, 3, 1),
        new Block(4, 8, 3, 3, 1), new Block(7, 8, 2, 3, 1),
        new Block(6, 3, 3, 3, 1),
    ], [
        new Category("water", [
            new Rule(27, [new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(29, [new Pos(0, -1), new Pos(1, 0), ]),
            new Rule(45, [new Pos(-1, 0), new Pos(0, 1), ]),
            new Rule(47, [new Pos(1, 0), new Pos(0, 1), ]),
            new Rule(36, [new Pos(-1, 0), ]),
            new Rule(28, [new Pos(0, -1), ]),
            new Rule(46, [new Pos(0, 1), ]),
            new Rule(38, [new Pos(1, 0), ]),
            new Rule(10, [new Pos(1, 1), ]),
            new Rule(11, [new Pos(-1, 1), ]),
            new Rule(19, [new Pos(1, -1), ]),
            new Rule(20, [new Pos(-1, -1), ]),
            new Rule(37, []),
            new Rule(54, []),
            new Rule(55, []),
            new Rule(56, []),
            new Rule(57, []),
            new Rule(58, []),
            new Rule(59, []),
            new Rule(60, []),
            new Rule(61, []),
            new Rule(62, []),
        ], true, 9),
        new Category("dirt", [
            new Rule(30, [new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(32, [new Pos(0, -1), new Pos(1, 0), ]),
            new Rule(48, [new Pos(-1, 0), new Pos(0, 1), ]),
            new Rule(50, [new Pos(1, 0), new Pos(0, 1), ]),
            new Rule(39, [new Pos(-1, 0), ]),
            new Rule(31, [new Pos(0, -1), ]),
            new Rule(49, [new Pos(0, 1), ]),
            new Rule(41, [new Pos(1, 0), ]),
            new Rule(13, [new Pos(1, 1), ]),
            new Rule(14, [new Pos(-1, 1), ]),
            new Rule(22, [new Pos(1, -1), ]),
            new Rule(23, [new Pos(-1, -1), ]),
            new Rule(40, []),
        ], true, 9),
    ], 0, [[0,1,2,3,4,5,6,7,8,15,16], [37,54,55,56,57,58,59,60,61,62], ])

    tileSet.furniture = new TileSet(imageArray.furniture, [
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
        new Block(4, 0, 3, 2, 0), new Block(7, 0, 2, 2, 0),
        new Block(4, 2, 3, 2, 0), new Block(7, 2, 2, 2, 0),
        new Block(0, 8, 3, 1, 0), new Block(4, 8, 3, 1, 0),
        new Block(6, 11, 1, 2, 0), new Block(0, 13, 2, 3, 1),
        new Block(2, 13, 2, 3, 1), new Block(7, 13, 3, 3, 1),
        new Block(7, 10, 3, 3, 1), new Block(0, 9, 1, 3, 1),
        new Block(8, 4, 1, 3, 1), new Block(4, 10, 2, 3, 0),
        new Block(4, 13, 2, 3, 0), new Block(6, 13, 1, 3, 0),
        new Block(1, 9, 3, 2, 1),
    ], [
        new Category("fence1", [
            new Rule(43, [new Pos(0, 1), new Pos(1, 0), new Pos(0, -1), new Pos(-1, 0), ]),
            new Rule(53, [new Pos(-1, 0), new Pos(0, -1), new Pos(1, 0), ]),
            new Rule(73, [new Pos(-1, 0), new Pos(0, 1), new Pos(1, 0), ]),
            new Rule(40, [new Pos(0, 1), new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(42, [new Pos(0, 1), new Pos(1, 0), new Pos(0, -1), ]),
            new Rule(50, [new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(52, [new Pos(0, -1), new Pos(1, 0), ]),
            new Rule(70, [new Pos(-1, 0), new Pos(0, 1), ]),
            new Rule(72, [new Pos(0, 1), new Pos(1, 0), ]),
            new Rule(41, [new Pos(0, 1), new Pos(0, -1), ]),
            new Rule(63, [new Pos(-1, 0), new Pos(1, 0), ]),
            new Rule(51, [new Pos(0, -1), ]),
            new Rule(60, [new Pos(-1, 0), ]),
            new Rule(71, [new Pos(0, 1), ]),
            new Rule(62, [new Pos(1, 0), ]),
            new Rule(61, []),
        ], false, 10),
    ], -1, [])

    tileMap.ground = new TileMap(tileSet.floor, 16, 16, 8, 21, 1, 1, [
        0,   0,   0,   0,   0,   0,   0,  36,  37,  37,  37,  38,   0,   0,   0,   0,
        0,   0,   0,   0,  27,  28,  28,  20,  37,  37,  37,  38,   0,   0,   0,   0,
        0,  27,  28,  28,  20,  37,  37,  37,  37,  37,  37,  38,   0,   0,   0,   0,
        0,  36,  37,  37,  37,  37,  37,  37,  37,  37,  37,  19,  28,  29,   0,   0,
        28,  20,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  19,  29,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  10,  47,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,   0,
        37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  37,  38,   0,   0,
        46,  46,  46,  46,  46,  46,  46,  11,  37,  37,  37,  37,  37,  38,   0,   0,
        0,   0,   0,   0,   0,   0,   0,  45,  46,  46,  46,  46,  46,  47,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    ])
    tileMap.objects = new TileMap(tileSet.furniture, 16, 16, 8, 21, 1, 1, [
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,  43,   0,   0,   0,  43,   0,   0,  43,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,  43,   0,   0,   0,   0,   0,   0,   0,
    ])
}