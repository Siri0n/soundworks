var React = require("react");

module.exports = function({data:{name, frequency}, remove, modify}){
	return <div className="audio-node">
		<div>
			<span className="name">{name}</span>
			<span className="close" onClick={remove}>x</span>
		</div>
		<input type="text" defaultValue={frequency} onChange={e => modify("frequency", e.target.value)}/> 
	</div>
}