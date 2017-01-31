var Instructions = require("./instructions.js");
var Immutable = require("immutable");

var ctx, main;

function createContext(){
	return new (window.AudioContext || window.webkitAudioContext)();
}

function isWaveform(type){
	return ["sine", "sawtooth", "square", "triangle"].includes(type);
}

function forAllNodesOfType(type, view, cb){
	var nodes = view.getIn(["lists", type, "nodes"])
	nodes && nodes.forEach(id => cb(view.getIn(["nodes", id]), id))
}

function ComplexNode(ctx, view){
	var self = this;
	var nodes = {};
	var oscillators = [];
	var instructions = [];
	var customs = [];
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

	forAllNodesOfType("instruction", view, function(data, id){
		var i = nodes[id] = new Instructions(ctx, data.get("text"), data.get("bar"));
		instructions.push(i);
	});

	forAllNodesOfType("delay", view, function(data, id){
		var d = nodes[id] = ctx.createDelay(data.get("maxDelay"));
		d.delayTime.value = data.get("delayTime");
	});

	forAllNodesOfType("custom", view, function(data, id){
		var c = nodes[id] = new ComplexNode(ctx, data);
		customs.push(c);
	});

	var exp = view.getIn(["nodes", "-1", "connections", "data"]);

	exp && exp.forEach((data, key) => {
		var key_ = key.replace(".", "_");
		var node = nodes[data.get("id")];
		var param = data.get("param");
		self[key_] = param ? node[param] : node;
		return true;
	})

	view.get("nodes").forEach(function(data, id){
		var node = nodes[id];
		if(!node){
			return true;
		}
		data.getIn(["connections", "data"]).forEach(function(elem){
			var target = nodes[elem.get("id")];
			if(elem.get("param")){
				node.connect(target[elem.get("param")]);
			}else{
				node.connect(target);
			}
		});
		return true;
	});

	this.start = function(){
		oscillators.forEach(o => o.start());
		instructions.forEach(i => i.start());
		customs.forEach(c => c.start());
	}

	this.stop = function(){
		oscillators.forEach(o => o.stop());
		instructions.forEach(i => i.stop());
		customs.forEach(c => c.stop());
	}

	this.connect = function(arg){
		nodes[0].connect(arg);
	}

	this.disconnect = function(){
		//niy
	}
}

function play(state){
	ctx = createContext();
	main = new ComplexNode(ctx, state);
	main.start();
}

function stop(){
	main.stop();
	main = null;
	ctx.close();
	ctx = null;
}

module.exports = {play, stop}