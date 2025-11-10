var gulp = require('gulp');
const terser = require('gulp-terser');
const deleteLines = require('gulp-delete-lines');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
return gulp.src([
    "./src/actions/action.js",
    "./src/auto_tiling.js",
    "./src/collisions.js",
    "./src/constraint.js",
    "./src/drag.js",
    "./src/draw.js",
    "./src/functions.js",
    "./src/renderable.js",
    "./src/image.js",
    "./src/image_array.js",
    "./src/input.js",
    "./src/key.js",
    "./src/layer.js",
    "./src/names.js",
    "./src/nine_patch.js",
    "./src/parser.js",
    "./src/physics.js",
    "./src/point.js",
    "./src/pivot.js",
    "./src/box.js",
    "./src/canvas.js",
    "./src/project.js",
    "./src/region.js",
    "./src/block.js",
    "./src/save_load.js",
    "./src/shape.js",
    "./src/sprite.js",
    "./src/angular_sprite.js",
    "./src/function/function.js",
    "./src/system.js",
    "./src/texture.js",
    "./src/tile_map.js",
    "./src/tile_map_transform.js",
    "./src/tile_set.js",
    "./src/vector_sprite.js",
    "./src/gui/label.js",
    "./src/variable/number.js",
    ])
    .pipe(concat('furca.js'))
    .pipe(deleteLines({
        'filters': [
            "^import.*$"
        ]
    }))
    //.pipe(terser())
    .pipe(gulp.dest('../'));
});