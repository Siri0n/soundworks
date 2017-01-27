var React = require("react");

module.exports = function({Node, type, methods, state}){
	var data = state.getIn(["lists", type]);
	var connecting = state.get("connecting");
	var nodes = state.get("nodes");
	var waves = (type == "oscillator") && state.getIn(["lists", "wave", "nodes"]);
	return <div> 
		<div>
			{type + " nodes      "} 
			<span className="collapse" onClick={() => methods.toggleCollapsed(type)}>{data.get("collapsed") ? "expand" : "collapse"}</span>
		</div>
		{!data.get("collapsed") && <div className="nodeList">
			{data.get("nodes").map(id => {
				return <Node 
					key={id} 
					data={nodes.get(id)} 
					{...{id, type, nodes, waves, methods, connecting}}/>
			})}
			<button className="add" onClick={() => methods.create(type)}>add</button>
		</div>}
	</div>
}