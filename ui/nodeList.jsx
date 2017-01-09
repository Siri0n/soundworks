var React = require("react");

module.exports = function({data, Node, type, names, methods, connecting}){
	return <div> 
		<div>
			{type + " nodes      "} 
			<span className="collapse" onClick={() => methods.toggleCollapsed(type)}>{data.get("collapsed") ? "expand" : "collapse"}</span>
		</div>
		{!data.get("collapsed") && <div className="nodeList">
			{data.get("ids").map(id => {
				var node = data.getIn(["nodes", id]);
				return <Node 
					key={id} 
					data={node} 
					{...{id, type, names, methods, connecting}}/>
			})}
			<button className="add" onClick={() => methods.add(type)}>add</button>
		</div>}
	</div>
}