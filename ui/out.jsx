var React = require("react");

module.exports = function({connecting, connectTo}){
	var connectable = connecting && connecting.get("nodeType") != "instructions";
	return <div className="audio-node output">
		<span className={connectable ? "highlighted" : null} onClick={connectable ? connectTo : null}>
			Output
		</span>
	</div>
}