var Communicator = require("./communicator.js");


function Compiler(){
	var sandbox = document.createElement("iframe");
	sandbox.setAttribute("src", "sandbox.html");
	sandbox.setAttribute("sandbox", "allow-scripts");
	sandbox.setAttribute("style", "");
	document.body.appendChild(sandbox);
	var c = new Communicator(sandbox.contentWindow);

	var resolveReady;
	var ready = new Promise(resolve => resolveReady = resolve);
	c.onMessage(msg => {console.log("compiler got msg", msg)})
	c.onMessage(msg => {msg == "connected" && resolveReady()});

	this.compile = function(script){
		console.log("compilator is compiling");
		script = `(function(str, state){${script}})`;
		return ready
		.then(() => console.log("connection is ready"))
		.then(() => c.postMessage({type: "compile", script})) 
		.then(id => {console.log("got id", id); return id})
		.then(scriptId => strings => c.postMessage({type: "call", scriptId, strings}))
	},

	this.destroy = function(){
		document.body.removeChild(sandbox);
	}
}

module.exports = Compiler;