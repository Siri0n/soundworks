var React = require("react");
module.exports = function({param, name, value, connectable, modify, connectTo}){
	return <div className="audio-param">
		<span className={connectable ? "highlighted" : ""} onClick={connectable ? (() => connectTo(param)): null}>
			{name + ": "}
		</span>
		<input type="text" defaultValue={value} onChange={e => modify(param, e.target.value)}/>
	</div>
}