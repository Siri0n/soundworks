var Compiler = require("./compiler.js");
var CustomNode = require("./customNode.js");

var ctx, main, compiler;

function createContext(){
	return new (window.AudioContext || window.webkitAudioContext)();
}

function play(state){
	ctx = createContext();
	compiler = new Compiler();
	main = new CustomNode(ctx, compiler, state);
	main.ready().then(
		() => {console.log("start!"); main.start();}
	);
}

function stop(){
	main.stop();
	main = null;
	ctx.close();
	ctx = null;
	compiler.destroy();
}

module.exports = {play, stop}