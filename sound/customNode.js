var Code = require("./code.js");
var Transformer = require("./transformer.js");
var Immutable = require("immutable");

function isWaveform(type){
	return ["sine", "sawtooth", "square", "triangle"].includes(type);
}

function forAllNodesOfType(type, view, cb){
	var nodes = view.getIn(["lists", type, "nodes"])
	nodes && nodes.forEach(id => cb(view.getIn(["nodes", id]), id))
}

function Counter(i){
	console.log(i);
	var counted;
	this.onZero = new Promise((resolve, reject) => {
		counted = resolve;
	});
	(i < 1) && counted();
	this.inc = () => {++i; console.log(i); return this};
	this.dec = () => {(--i < 1) && counted(); console.log(i); return this};
}

function CustomNode(ctx, compiler, view){
	var self = this;
	var nodes = {};
	var oscillators = [];
	var codes = [];
	var transformers = [];
	var customs = [];

	var plugin;

	var type = view.get("nodeType");
	
	if(type == "root"){
		nodes[0] = ctx.destination;
	}else{
		nodes[0] = ctx.createGain();
		nodes[0].gain.value = 1;
	}

	forAllNodesOfType("wave", view, function(data, id){
		var r = new Float32Array(data.get("coefs").map(elem => elem.get(0)).unshift(0).toJS());
		var i = new Float32Array(data.get("coefs").map(elem => elem.get(1)).unshift(0).toJS());
		nodes[id] = ctx.createPeriodicWave(r, i, {disableNormalization: true});
	});

	forAllNodesOfType("oscillator", view, function(data, id){
		var o = nodes[id] = ctx.createOscillator();
		oscillators.push(o);
		o.frequency.value = data.get("frequency");
		o.detune.value = data.get("detune");
		var type = data.get("type");
		if(isWaveform(type)){
			o.type = type;
		}else{
			o.setPeriodicWave(nodes[type]);
		}
	});

	forAllNodesOfType("gain", view, function(data, id){
		var g = nodes[id] = ctx.createGain();
		g.gain.value = data.get("gain");
	});

	forAllNodesOfType("code", view, function(data, id){
		var i = nodes[id] = new Code(ctx, data.get("text"));
		codes.push(i);
	});

	forAllNodesOfType("transformer", view, function(data, id){
		var i = nodes[id] = new Transformer(ctx, compiler, data.get("text"));
		transformers.push(i);
	});

	forAllNodesOfType("delay", view, function(data, id){
		var d = nodes[id] = ctx.createDelay(data.get("maxDelay"));
		d.delayTime.value = data.get("delayTime");
	});

	forAllNodesOfType("custom", view, function(data, id){
		var c = nodes[id] = new CustomNode(ctx, compiler, data);
		customs.push(c);
	});

	var exp = view.get("connections").filter(c => c.getIn(["from", "id"]) == "-1");

	exp.forEach((c, cid) => {
		var {id, param} = c.get("to").toJS();
		var node = nodes[id];
		self[cid] = param ? node[param] : node;
		return true;
	})

	view.get("connections").forEach((c, cid) => {
		c = c.toJS();
		var nodeFrom = nodes[c.from.id],
			nodeTo = nodes[c.to.id];
		if(!nodeFrom || !nodeTo){
			return true;
		}
		if(c.from.param){
			throw new Error("Not implemented yet");
		}
		if(c.to.param){
			nodeFrom.connect(nodeTo[c.to.param], c.name);
		}else{
			nodeFrom.connect(nodeTo, c.name);
		}
	});


	this.getAllCodes = function(){
		return customs.reduce(
			(acc, next) => acc.concat(next.getAllCodes()), 
			codes
		)
	}

	this.getAllTransformers = function(){
		return customs.reduce(
			(acc, next) => acc.concat(next.getAllTransformers()), 
			transformers
		)
	}

	this.ready = function(){
		var transformers = self.getAllTransformers();
		return Promise.all(transformers.map(t => t.compile()))
		.then(() => {
			console.log("compiled!");
			var codes = self.getAllCodes();
			var counter = new Counter(codes.length);
			codes.forEach(c => c.start(counter));
			return counter.onZero;
		}, function(error){
			throw error;
		});
	}

	this.start = function(){
		oscillators.forEach(o => o.start());
		customs.forEach(c => c.start());
	}

	this.stop = function(){
		oscillators.forEach(o => o.stop());
		customs.forEach(c => c.stop());
	}

	this.connect = function(arg){
		nodes[0].connect(arg);
	}
}

module.exports = CustomNode;