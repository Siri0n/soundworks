var React = require("react");
module.exports = function({name, connecting, remove, connectTo}){
	return <div>
		<span className={connecting ? "highlighted" : ""} onClick={connecting ? connectTo : null}>
			{name}
		</span>
		<span className="close" onClick={remove}>
			x
		</span>
	</div>
}