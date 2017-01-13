var React = require("react");
var ListManager = require("./listManager.jsx");
var Synthesizer = require("./synthesizer.jsx");
var Editor = require("./editor.jsx");
var Text = require("./text.jsx");

module.exports = function(){
	return <div> 
		<ListManager/>
		<Synthesizer/>
		<Editor/>
		<Text/>
	</div>
}	