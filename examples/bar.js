var BAR_DELIMITER = "/---/";
var fractionRegex = /([0-9]+)\/([1-9][0-9]*)/;

var now = 0;
var bar = 0;

function timeFraction(arg){
	var match = fractionRegex.exec(arg);
	if(match){
		arg = bar*match[1]/match[2];
	}
	return arg;
}

this.main = function(str){
	var args = str.split(/\s+/);
	if(args[0] == "bar"){
		bar = args[1] - 0;
		return [];	
	}else if(args[0] == BAR_DELIMITER){
		now += (args[1] ? timeFraction(args[1]) : bar);
		return [];	
	}else{
		args = args.map(timeFraction);
		args[0] += now;
		return ["_ " + args.join(" ")];
	}
}