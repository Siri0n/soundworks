const TYPE = "transformer";

function Transformer(ctx, text){
	var connections = {};
	var transform;
	this.type = TYPE;
	this.text = text;

	this.init = function(transform_){
		transform = transform_;
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
				console.log("FUCK YOU");
				console.log(result);
				var outStrings = {};
				result.forEach(string => {
					var [name, rest] = string.split(/\s+/);
					outStrings[name] = outStrings[name] || [];
					outStrings[name].push(rest);
				})
				console.log(outStrings);
				Object.keys(connections).forEach(name => {
					var out = connections[name];
					var data = outStrings[name];
					if(!out || !data){
						return;
					}
					if(out.type == TYPE){
						out.push(data, counter.inc());
					}else{
						data.forEach(string => {
							var [method, ...args] = string.split(/\s+/g);
							console.log(method + "(" + args.join(", ") + ")");
							out[method](...args);
						});
					}
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