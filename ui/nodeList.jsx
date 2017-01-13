var React = require("react");

module.exports = function({data, Node, type, names, waves, methods, connecting}){
	return <div> 
		<div>
			{type + " nodes      "} 
			<span className="collapse" onClick={() => methods.toggleCollapsed(type)}>{data.get("collapsed") ? "expand" : "collapse"}</span>
		</div>
		{!data.get("collapsed") && <div className="nodeList">
			{data.get("ids").map(id => {
				var node = data.getIn(["nodes", id]);
				console.log(node, data.toJS(), id);
				return <Node 
					key={id} 
					data={node} 
					{...{id, type, names, methods, waves, connecting}}/>
			})}
			<button className="add" onClick={() => methods.add(type)}>add</button>
		</div>}
	</div>
}