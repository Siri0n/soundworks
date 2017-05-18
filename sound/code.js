function Code(ctx, text){
	var connections = [];

	this.connect = function(arg){
		connections.push(arg);
	}

	this.start = function(counter){
		var strings = text.split("\n");
		connections.forEach(c => c.push(strings, counter.inc()));
		counter.dec();
	}

	this.stop = function(){};
}

module.exports = Code;