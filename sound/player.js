var Instructions = require("./instructions.js");

var ctx = new (window.AudioContext || window.webkitAudioContext)();
var nodes = {};
var oscillators = [];
var instructions = [];

function isWaveform(type){
	return ["sine", "sawtooth", "square", "triangle"].includes(type);
}

function play(state){
	nodes[0] = ctx.destination;
	state.getIn(["lists", "periodicWave", "nodes"]).forEach(function(data, id){
		var r = new Float32Array(data.get("coefs").map(elem => elem.get(0)).unshift(0).toJS());
		var i = new Float32Array(data.get("coefs").map(elem => elem.get(1)).unshift(0).toJS());
		nodes[id] = ctx.createPeriodicWave(r, i, {disableNormalization: true});
		
	});
	state.getIn(["lists", "oscillator", "nodes"]).forEach(function(data, id){
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
	state.getIn(["lists", "gain", "nodes"]).forEach(function(data, id){
		var g = nodes[id] = ctx.createGain();
		g.gain.value = data.get("gain");
	});
	state.getIn(["lists", "instructions", "nodes"]).forEach(function(data, id){
		var i = nodes[id] = new Instructions(ctx, data.get("text"), data.get("bar"));
		instructions.push(i);
	});
	state.getIn(["lists", "delay", "nodes"]).forEach(function(data, id){
		var d = nodes[id] = ctx.createDelay(data.get("maxDelay"));
		d.delayTime.value = data.get("delayTime");
	});
	state.get("lists").forEach(function(list, type){
		if(type == "periodicWave"){
			return true;
		}
		list.get("nodes").forEach(function(data, id){
			var node = nodes[id];
			if(data.getIn(["connections", "data"]).size){
				data.getIn(["connections", "data"]).forEach(function(elem, id){
					var target = nodes[elem.get("id")];
					if(elem.get("param")){
						node.connect(target[elem.get("param")]);
					}else{
						node.connect(target);
					}
				})
			}
			return true;
		});
		return true;
	});
	oscillators.forEach(o => o.start());
	instructions.forEach(i => i.start());
}

function stop(){
	nodes = {};
	oscillators.forEach(o => o.stop());
	oscillators = [];
	instructions.forEach(i => i.stop());
	instructions = [];
}

module.exports = {play, stop}