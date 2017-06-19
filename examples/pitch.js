var A4 = 440;
var A4pow = 4.75;
var regex = /^([A-G])([#b]?)((?:-[0-9]+)|(?:[0-9]*))$/;
var notes = {
	"C": 0,
	"D": 2,
	"E": 4,
	"F": 5,
	"G": 7,
	"A": 9,
	"B": 11
}
var mods = {
	"#": 1,
	"b": -1,
	"": 0
}

this.main = function(str){
	var args = str.split(/\s+/);
	args = args.map(function(arg){
		var match = regex.exec(arg);
		var pow;
		if(match){
			pow = notes[match[1]] + mods[match[2]];
			pow = pow/12 + (match[3] - 0);
			pow -= A4pow;
			return Math.pow(2, pow)*A4;
		}else{
			return arg;
		}
	});

	return ["_ " + args.join(" ")];
}