var React = require("react");
var connect = require("react-redux").connect;
var player = require("../sound/player.js");

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
		<div className="stop" onClick={function(){player.stop(); togglePlaying();}}/> :
		<div className="play" onClick={function(){player.play(state); togglePlaying();}}/>
		}
	</div>
})