var gulp = require('gulp');
var watch = require("gulp-watch");
var browserify = require("browserify");
var watchify = require("watchify");
var inject = require("gulp-inject");
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

var s = browserify({
	entries: ["sandbox.js"],
	debug: true,
	plugin: ["watchify"]
}).transform(
	"babelify", 
	{
		presets: ["es2015"],
		plugins: ["transform-object-rest-spread"]
	}
);

var w = browserify({
	entries: ["worker.js"],
	debug: true,
	plugin: ["watchify"]
}).transform(
	"babelify", 
	{
		presets: ["es2015"],
		plugins: ["transform-object-rest-spread"]
	}
);

b.on("update", bundle);
s.on("update", () => bundleSandbox().on("end", injectSandbox));
w.on("update", () => bundleWorker().on("end", injectSandbox));
gulp.task("browserify", bundle);
gulp.task("browserify-sandbox", bundleSandbox);
gulp.task("browserify-worker", bundleWorker);
gulp.task("injectSandbox", ["browserify-sandbox", "browserify-worker"], injectSandbox);
gulp.task("default", ["browserify", "injectSandbox"]);

function bundle(){
	console.log("Transforming bundle.js...");
	return b.bundle()
		.on("error", function(error){
			console.log(error + "");
		})
		.on("end", console.log.bind(console, "bundle.js transformed!"))
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("./"));
}

function bundleSandbox(){
	console.log("Transforming sandbox-bundle.js...");
	return s.bundle()
		.on("error", function(error){
			console.log(error + "");
		})
		.on("end", console.log.bind(console, "sandbox-bundle.js transformed!"))
		.pipe(source("sandbox-bundle.js"))
		.pipe(gulp.dest("./"));
}

function bundleWorker(){
	console.log("Transforming worker-bundle.js...");
	return w.bundle()
		.on("error", function(error){
			console.log(error + "");
		})
		.on("end", console.log.bind(console, "worker-bundle.js transformed!"))
		.pipe(source("worker-bundle.js"))
		.pipe(gulp.dest("./"));
}
function injectSandbox(){
	console.log("Injecting into sandbox.html...");
	return gulp.src("sandbox.html")
		.pipe(
			inject(
				gulp.src(["./sandbox-bundle.js"]),
				{	
					starttag: "<!-- inject:sandbox:js -->",
					transform: function (filePath, file) {
      					return "<script>" + file.contents.toString('utf8') + "</script>";
   					}
				}
			)
		)
		.pipe(
			inject(
				gulp.src(["./worker-bundle.js"]),
				{
					starttag: "<!-- inject:worker:js -->",
					transform: function (filePath, file) {
      					return '<script id="worker-script">' + file.contents.toString('utf8') + "</script>";
   					}
				}
			)
		)
		.on("error", function(error){
			console.log(error);
		})
		.on("end", console.log.bind(console, "sandbox-bundle.js injected!"))
		.pipe(gulp.dest("./"));
}