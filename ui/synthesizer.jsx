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
		{state.playing ?
		<div className="stop" onClick={function(){stop(); togglePlaying();}}/> :
		<div className="play" onClick={function(){play(state); togglePlaying();}}/>
		}
	</div>
})

var nodes = {};
var oscillators = [];
var ctx = new (window.AudioContext || window.webkitAudioContext)();

function play(state){

	state.nodes.oscillator.forEach(function(data){
		var o = nodes[data.id] = ctx.createOscillator();
		oscillators.push(o);
		o.frequency.value = data.frequency;
	});
	state.nodes.gain.forEach(function(data){
		var g = nodes[data.id] = ctx.createGain();
		g.gain.value = data.gain;
	});
	["oscillator", "gain"].forEach(function(key){
		state.nodes[key].forEach(function(data){
			var node = nodes[data.id];
			if(data.connect){
				data.connect.forEach(function(elem){
					var target = nodes[elem.id];
					if(elem.param){
						node.connect(target[elem.param]);
					}else{
						node.connect(target);
					}
				})
			}else{
				node.connect(ctx.destination);
			}
		});
	});
	oscillators.forEach(o => o.start());
}

function stop(){
	nodes = {};
	oscillators.forEach(o => o.stop());
	oscillators = [];
	console.log("Stop right there, criminal scum!");
}