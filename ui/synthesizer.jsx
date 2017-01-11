var React = require("react");
var connect = require("react-redux").connect;

module.exports = connect(
	function(state){
		return {state}
	},
	function(dispatch){
		return {
			togglePlaying(){
				dispatch({type: "TOGGLE_PLAYING"});
			}
		}
	}
)(function({state, togglePlaying}){
	return <div>
		{state.get("playing") ?
		<div className="stop" onClick={function(){stop(); togglePlaying();}}/> :
		<div className="play" onClick={function(){play(state); togglePlaying();}}/>
		}
	</div>
})

var nodes = {};
var oscillators = [];
var ctx = new (window.AudioContext || window.webkitAudioContext)();

function isWaveform(type){
	return ["sine", "sawtooth", "square", "triangle"].includes(type);
}

function play(state){
	state.getIn(["lists", "periodicWave", "nodes"]).forEach(function(data, id){
		var r = new Float32Array(data.get("coefs").map(elem => elem.get(0)).unshift(0).toJS());
		var i = new Float32Array(data.get("coefs").map(elem => elem.get(1)).unshift(0).toJS());
		console.log(r, i);
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
			console.log(nodes[type]);
			o.setPeriodicWave(nodes[type]);
		}
	});
	state.getIn(["lists", "gain", "nodes"]).forEach(function(data, id){
		var g = nodes[id] = ctx.createGain();
		g.gain.value = data.get("gain");
	});
	state.get("lists").forEach(function(list, type){
		if(type == "periodicWave"){
			return true;
		}
		list.get("nodes").forEach(function(data, id){
			var node = nodes[id];
			console.log(data);
			if(data.getIn(["connections", "data"]).size){
				data.getIn(["connections", "data"]).forEach(function(elem, id){
					var target = nodes[elem.get("id")];
					if(elem.get("param")){
						node.connect(target[elem.get("param")]);
					}else{
						node.connect(target);
					}
				})
			}else{
				node.connect(ctx.destination);
			}
			return true;
		});
		return true;
	});
	oscillators.forEach(o => o.start());
}

function stop(){
	nodes = {};
	oscillators.forEach(o => o.stop());
	oscillators = [];
	console.log("Stop right there, criminal scum!");
}