const TYPE = "transformer";

function Transformer(ctx, compiler, text){
	var connections = {};
	var transform;
	var state;
	this.type = TYPE;
	this.text = text;

	this.compile = function(){
		return compiler.compile(text)
		.then(f => transform = f);
	} 

	this.connect = function(arg, name){
		connections[name] = connections[name] || [];
		connections[name].push(arg);
	}

	this.push = function(strings, counter){
		if(!transform){
			throw new Error("Transformer is not initialised");
		}
		transform(strings).then(
			result => {
				var outStrings = {};
				result.forEach(string => {
					var [name, ...rest] = string.split(/\s+/);
					outStrings[name] = outStrings[name] || [];
					outStrings[name].push(rest.join(" "));
				})
				Object.keys(connections).forEach(name => {
					var outputs = connections[name];
					var data = outStrings[name];
					if(!outputs || !data){
						return;
					}
					outputs.forEach(out => {
						if(out.type == TYPE){
							out.push(data, counter.inc());
						}else{
							data.forEach(string => {
								var [method, ...args] = string.split(/\s+/);
								out[method](...args);
							});
						}
					});
				});
				counter.dec();
			}, 
			error => {
				throw error;
			}
		);
	}
}

module.exports = Transformer;