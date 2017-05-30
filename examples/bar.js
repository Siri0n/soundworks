var BAR_DELIMITER = "/---/";

var args = str.split(/\s+/);
if(args[0] == "bar"){
	state.bar = args[1] - 0;
	return [];	
}else if(str == BAR_DELIMITER){
	state.now = state.now || 0;
	state.now += state.bar;
	return [];	
}else{
	args[0] += state.now;
	return ["_ " + args.join(" ")];
}