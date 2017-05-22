if(!self.window){(function(){

	var Communicator = require("./sound/communicator.js");

	var c = new Communicator();

	let id = 1;
	let newId = function(){return id++};
	let scripts = {};
	let states = {};

	c.onMessage(function(msg, cb){
		if(msg.type == "test"){
			cb(msg.msg + " lol");
		}else if(msg.type == "compile"){
			let scriptId = newId();
			console.log("worker is compiling", msg.script);
			scripts[scriptId] = eval(msg.script);
			console.log("compiled", scriptId, scripts[scriptId]);
			states[scriptId] = {};
			cb(scriptId);
		}else if(msg.type == "call"){
			let result = [];
			let state = states[msg.scriptId];
			let f = scripts[msg.scriptId];
			for(let string of msg.strings){
				result = [...result, ...f(string, state)];
			}
			cb(result);
		}
	});

})()}
