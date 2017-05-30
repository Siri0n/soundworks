var Compiler = require("./compiler.js");
var CustomNode = require("./customNode.js");

var ctx, main, compiler;

function createContext(){
	var ctx = new (window.AudioContext || window.webkitAudioContext)();
	ctx.suspend();
	return ctx;
}

function play(state){
	ctx = createContext();
	compiler = new Compiler();
	main = new CustomNode(ctx, compiler, state);
	main.ready().then(
		() => {ctx.resume(); main.start();}
	);
}

function stop(){
	if(!main){
		return;
	}
	main.stop();
	main = null;
	ctx.close();
	ctx = null;
	compiler.destroy();
}

module.exports = {play, stop}