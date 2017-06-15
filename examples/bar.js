var BAR_DELIMITER = "/---/";
var fractionRegex = /([0-9]+)\/([1-9][0-9]*)/;

var args = str.split(/\s+/);

state.now = state.now || 0;

if(args[0] == "bar"){
	state.bar = args[1] - 0;
	return [];	
}else if(str == BAR_DELIMITER){
	state.now += state.bar;
	return [];	
}else{
	args = args.map(function(arg){
		var match = fractionRegex.exec(arg);
		if(match){
			arg = state.bar*match[1]/match[2];
		}
		return arg;
	});
	args[0] += state.now;
	return ["_ " + args.join(" ")];
}