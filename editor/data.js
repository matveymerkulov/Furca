import TileSet from "../src/tile_set.js"
import TileMap from "../src/tile_map.js"
import ImageArray from "../src/image_array.js"
import {tileMap, tileMaps, tileSet} from "../src/project.js"
import {Block} from "../src/block.js"
import {Category, Pos, Rule} from "./auto_tiling.js"

export function loadData(texture) {
    tileSet["floor"] = new TileSet(new ImageArray(texture.floor, 9, 11, 0.5, 0.5, 1, 1), [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 0, 0, 0,
        1, 0, 1, 1, 1, 1, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
    ], [
        new Block(6, 4, 3, 3, 1), new Block(0, 8, 3, 3, 1),
        new Block(3, 8, 1, 3, 1), new Block(4, 8, 3, 3, 1),
        new Block(7, 8, 2, 3, 1),
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
        ], true),
    ])
    tileSet["objects"] = new TileSet(new ImageArray(texture.objects, 10, 16, 0.5, 0.5, 1, 1), [
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
        ], false),
    ])
    tileSet["blocks"] = new TileSet(new ImageArray(texture.blocks, 7, 7, 0.5, 0.5, 1, 1), [
        0, 1, 1, 1, 1, 1, 0,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1,
    ], [], [
        new Category("tetris", [
            new Rule(6, [new Pos(0, 1), new Pos(1, 0), new Pos(0, -1), new Pos(-1, 0), ]),
            new Rule(2, [new Pos(0, 1), new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(4, [new Pos(0, -1), new Pos(1, 0), new Pos(0, 1), ]),
            new Rule(20, [new Pos(-1, 0), new Pos(0, -1), new Pos(1, 0), ]),
            new Rule(48, [new Pos(-1, 0), new Pos(0, 1), new Pos(1, 0), ]),
            new Rule(3, [new Pos(0, 1), new Pos(0, -1), ]),
            new Rule(34, [new Pos(-1, 0), new Pos(1, 0), ]),
            new Rule(14, [new Pos(-1, 0), new Pos(0, -1), ]),
            new Rule(18, [new Pos(1, 0), new Pos(0, -1), ]),
            new Rule(42, [new Pos(-1, 0), new Pos(0, 1), ]),
            new Rule(46, [new Pos(0, 1), new Pos(1, 0), ]),
            new Rule(28, [new Pos(-1, 0), ]),
            new Rule(16, [new Pos(0, -1), ]),
            new Rule(32, [new Pos(1, 0), ]),
            new Rule(44, [new Pos(0, 1), ]),
            new Rule(30, []),
        ], false),
    ])

    tileMap["0-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, -10, 1, 1, [
        0,   0,   0,   0,
        2,   3,   3,   4,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["1-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, -5, 1, 1, [
        0,   0,   0,   0,
        2,  16,   4,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["2-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 0, 1, 1, [
        2,  18,   0,   0,
        0,  42,   4,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["3-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 5, 1, 1, [
        0,  14,   4,   0,
        2,  46,   0,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["4-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 10, 1, 1, [
        2,  18,   0,   0,
        0,  34,   0,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["5-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 15, 1, 1, [
        0,  14,   4,   0,
        0,  34,   0,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["6-0"] = new TileMap(tileSet["blocks"], 4, 4, -18, 20, 1, 1, [
        14,  18,   0,   0,
        42,  46,   0,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["0-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, -10, 1, 1, [
        0,  20,   0,   0,
        0,  34,   0,   0,
        0,  34,   0,   0,
        0,  48,   0,   0,
    ], -1)
    tileMap["1-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, -5, 1, 1, [
        0,  20,   0,   0,
        2,  32,   0,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["1-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, -5, 1, 1, [
        0,  20,   0,   0,
        2,  44,   4,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["1-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, -5, 1, 1, [
        0,  20,   0,   0,
        0,  28,   4,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["2-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 0, 1, 1, [
        0,   0,  20,   0,
        0,  14,  46,   0,
        0,  48,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["3-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 5, 1, 1, [
        0,  20,   0,   0,
        0,  42,  18,   0,
        0,   0,  48,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["4-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 10, 1, 1, [
        0,   0,  20,   0,
        2,   3,  46,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["4-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, 10, 1, 1, [
        0,  20,   0,   0,
        0,  34,   0,   0,
        0,  42,   4,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["4-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, 10, 1, 1, [
        0,   0,   0,   0,
        14,   3,   4,   0,
        48,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["5-1"] = new TileMap(tileSet["blocks"], 4, 4, -13, 15, 1, 1, [
        0,   0,   0,   0,
        2,   3,  18,   0,
        0,   0,  48,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["5-2"] = new TileMap(tileSet["blocks"], 4, 4, -8, 15, 1, 1, [
        0,  20,   0,   0,
        0,  34,   0,   0,
        2,  46,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["5-3"] = new TileMap(tileSet["blocks"], 4, 4, -3, 15, 1, 1, [
        20,   0,   0,   0,
        42,   3,   4,   0,
        0,   0,   0,   0,
        0,   0,   0,   0,
    ], -1)
    tileMap["field"] = new TileMap(tileSet["blocks"], 16, 24, 8, 0, 1, 1, [
        0,   0,  20,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  20,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  34,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  34,   0,   0,
        0,   0,  42,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,  46,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    ], -1)
    tileMap["ground"] = new TileMap(tileSet["floor"], 16, 16, 8, 21, 1, 1, [
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,   5,   5,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   5,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,  27,  28,  28,  28,  28,  28,  29,   0,   0,
        0,   0,   0,   0,   0,   0,  27,  20,  37,  37,  37,  37,  37,  19,  28,  28,
        0,   0,   0,   0,  27,  28,  20,  37,  37,  10,  46,  46,  11,  37,  37,  37,
        0,   0,   0,   0,  36,  37,  37,  37,  37,  38,   0,   0,  36,  37,  37,  37,
        0,   0,   0,   0,  36,  37,  37,  37,  37,  38,   0,   0,  36,  37,  37,  37,
        0,   0,   0,  27,  20,  37,  37,  37,  37,  19,  28,  28,  20,  37,  37,  37,
    ], -1)
    tileMap["objects"] = new TileMap(tileSet["objects"], 16, 16, 8, 21, 1, 1, [
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,  50,  41,  41,  41,  51,  41,  41,  41,  41,  52,   0,   0,
        0,   0,   0,   0,  63,   0,   0,   0,  63,   0,   0,   0,   0,  63,   0,   0,
        0,   0,   0,   0,  63,   0,   0,   0,  63,   0,   0,   0,   0,  63,   0,   0,
        0,   0,   0,   0,  63,   0,   0,   0,  60,  52,   0,   0,   0,  63,   0,   0,
        0,   0,   0,   0,  63,   0,   0,   0,  60,  72,   0,   0,   0,  63,   0,   0,
        0,   0,   0,   0,  63,   0,   0,   0,  63,   0,   0,   0,   0,  63,   0,   0,
        0,   0,   0,   0,  70,  41,  41,  41,  71,  41,  41,  41,  41,  72,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,  43,   0,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
        0,   0,  43,   0,   0,   0,  43,   0,   0,  43,   0,   0,   0,   0,   0,   0,
        0,   0,   0,   0,   0,   0,   0,   0,  43,   0,   0,   0,   0,   0,   0,   0,
    ], -1)

    tileMaps.add(
        tileMap["0-0"], tileMap["1-0"], tileMap["2-0"], tileMap["3-0"],
        tileMap["4-0"], tileMap["5-0"], tileMap["6-0"], tileMap["0-1"],
        tileMap["1-1"], tileMap["1-2"], tileMap["1-3"], tileMap["2-1"],
        tileMap["3-1"], tileMap["4-1"], tileMap["4-2"], tileMap["4-3"],
        tileMap["5-1"], tileMap["5-2"], tileMap["5-3"], tileMap["field"],
        tileMap["ground"], tileMap["objects"],
    )
}