if(!self.window){(function(){

	var Communicator = require("./sound/communicator.js");

	var c = new Communicator();

	let id = 1;
	let newId = function(){return id++};
	let scripts = {};

	c.onMessage(function(msg, cb){
		if(msg.type == "test"){
			cb(msg.msg + " lol");
		}else if(msg.type == "compile"){
			let scriptId = newId();
			scripts[scriptId] = eval(msg.script);
			cb(scriptId);
		}else if(msg.type == "call"){
			let result = [];
			let script = scripts[msg.scriptId];
			for(let string of msg.strings){
				result = [...result, ...script.main(string)];
			}
			cb(result);
		}
	});

})()}
