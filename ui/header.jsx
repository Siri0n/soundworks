var React = require("react");
module.exports = function({name, connectable, remove, connectTo}){
	return <div>
		<span className={connectable ? "highlighted" : ""} onClick={connectable ? connectTo : null}>
			{name}
		</span>
		<span className="close" onClick={remove}>
			x
		</span>
	</div>
}