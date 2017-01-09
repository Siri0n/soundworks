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

function play(state){

	state.getIn(["lists", "oscillator", "nodes"]).forEach(function(data, id){
		var o = nodes[id] = ctx.createOscillator();
		oscillators.push(o);
		o.frequency.value = data.get("frequency");
	});
	state.getIn(["lists", "gain", "nodes"]).forEach(function(data, id){
		var g = nodes[id] = ctx.createGain();
		g.gain.value = data.get("gain");
	});
	state.get("lists").forEach(function(list, type){
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