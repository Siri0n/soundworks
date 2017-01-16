const notes = {
	"C" : 0,
	"C#": 1, 
	"D" : 2,
	"D#": 3, 
	"E" : 4,
	"F" : 5,
	"F#": 6,
	"G" : 7,
	"G#": 8,
	"A" : 9,
	"A#": 10,
	"B" : 11
}

const methods = {
	"/": "linearRampToValueAtTime",
	"J": "exponentialRampToValueAtTime",
	"|": "setValueAtTime"
}

function parse(bar, str){
	var match = str.match(/(\/|\||J) (O|[0-9]+\.[0-9]+|[A-G]#?(?:[0-9]|10)?) ([0-9]+\.[0-9]+|[0-9]+(?:\/[0-9]+)?)/);
	return match && {
		operation: op(match[1]),
		value: freq(match[2]),
		duration: dur(match[3])*bar
	}
}

function op(str){
	return methods[str];
}

function freq(str){
	if(str == "O"){
		return 0;
	}else if(str - 0 == str - 0){
		return str - 0;
	}else{
		var match = str.match(/([A-G]#?)([0-9]|10)?/);
		var deg = (notes[match[1]] - 9)/12 + ((match[2] - 0) || 0);
		return Math.pow(2, deg - 4) * 440;
	}
}

function dur(str){
	if(str - 0 == str - 0){
		return str - 0;
	}else{
		var arr = str.split("/");
		return arr[0]/arr[1];
	}
}

function Instructions(ctx, program, bar){
	var connections = [];
	var instructions = program.split("\n").map(parse.bind(null, bar));
	this.connect = function(target){
		!connections.includes(target) && connections.push(target);
	}
	this.disconnect = function(target){
		var i = connections.indexOf(target);
		~i && connections.splice(i, 1);
	}
	this.start = function(){
		var time = ctx.currentTime;
		for(let inst of instructions){
			if(!inst){
				continue;
			}
			for(let param of connections){
				param[inst.operation](inst.value, time);
			}
			time += inst.duration;
		}
		for(let param of connections){
			param.setValueAtTime(0, time);
		}
	}
	this.stop = function(){
		connections.forEach(param => {
			param.cancelScheduledValues(0);
		})
	}
}

module.exports = Instructions;