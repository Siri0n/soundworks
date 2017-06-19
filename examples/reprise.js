var data = {};
var recording = null;

this.main = function(str){
	var args = str.split(/\s+/);
	if(recording){
		return this.record(args);
	}else{
		return this.scan(args);
	}
}

this.record = function(args){
	var str;
	if(args[0] == "end"){
		recording = null;
		return [];
	}else{
		str = "_ " + args.join(" ");
		data[recording].push(str);
		return [str];
	}
}

this.scan = function(args){
	if(args[0] == "reprise"){
		recording = args[1];
		data[recording] = [];
		return [];
	}else if(args[0] == "repeat"){
		return data[args[1]];
	}else{
		return ["_ " + args.join(" ")];
	}
}