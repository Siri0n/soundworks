var React = require("react");
var ListManager = require("./listManager.jsx");
var Synthesizer = require("./synthesizer.jsx");

module.exports = function(){
	return <div> 
		<ListManager types={["oscillator", "gain"]}/>
		<Synthesizer/>
	</div>
}	