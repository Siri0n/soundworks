var React = require("react");
var player = require("../sound/player.js");

module.exports = function({state, togglePlaying}){
	return <div>
		{state.get("playing") ?
		<div className="stop" onClick={function(){player.stop(); togglePlaying();}}/> :
		<div className="play" onClick={function(){player.play(state); togglePlaying();}}/>
		}
	</div>
}