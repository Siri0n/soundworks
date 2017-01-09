var React = require("react");
module.exports = function({param, name, value, connecting, modify, connectTo}){
	return <div className="audio-param">
		<span className={connecting ? "highlighted" : ""} onClick={connecting ? (() => connectTo(param)): null}>
			{name + ": "}
		</span>
		<input type="text" defaultValue={value} onChange={e => modify(param, e.target.value)}/>
	</div>
}