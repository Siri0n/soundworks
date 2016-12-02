var React = require("react");

module.exports = function({data:{name, test}, remove, modify}){
	return <div className="audio-node">
		<div>
			<span className="name">{name}</span>
			<span className="close" onClick={remove}>x</span>
		</div>
		<input type="text" defaultValue={test} onChange={e => modify("test", e.target.value)}/> 
		{test}
	</div>
}