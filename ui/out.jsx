var React = require("react");
var util = require("./util.js");

module.exports = function({connecting, connectTo}){
	var connectable = util.connectable.audioNode("0", connecting);
	return <div className="audio-node output">
		<span className={connectable ? "highlighted" : null} onClick={connectable ? connectTo : null}>
			Output
		</span>
	</div>
}