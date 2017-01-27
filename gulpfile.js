var gulp = require('gulp');
var watch = require("gulp-watch");
var browserify = require("browserify");
var watchify = require("watchify");
var source = require("vinyl-source-stream");

var b = browserify({
	entries: ["main.js"],
	debug: true,
	plugin: ["watchify"]
}).transform(
	"babelify", 
	{
		presets: ["es2015", "react"],
		plugins: ["transform-object-rest-spread"]
	}
);

b.on("update", bundle);
gulp.task("browserify", bundle);
gulp.task("default", ["browserify"]);

function bundle(){
	console.log("Transforming...");
	return b.bundle()
		.on("error", function(error){
			console.log(error + "");
		})
		.on("end", console.log.bind(console, "Transform was successful"))
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("./"));
}