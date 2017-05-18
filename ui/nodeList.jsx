var React = require("react");

function connectionsFor(view, id){
	return view.get("connections")
		.filter(c => c.getIn(["from", "id"]) == id)
		.entrySeq()
		.sort((c1, c2) => c1[0] - c2[0]);

}
module.exports = function({Node, type, methods, view}){
	var data = view.getIn(["lists", type]);
	var connecting = view.get("connecting");
	var nodes = view.get("nodes");
	var waves = (type == "oscillator") && view.getIn(["lists", "wave", "nodes"]);
	return <div> 
		<div style={{textAlign: "center"}}>
			{type + " nodes"} 
			<span className="collapse" onClick={() => methods.toggleCollapsed(type)}>
				collapse
			</span>
		</div>
		<div className="nodeList">
			{data.get("nodes").map(id => {
				return <Node 
					key={id} 
					data={nodes.get(id)}
					connections={connectionsFor(view, id)}
					{...{id, type, nodes, waves, methods, connecting}}/>
			})}
			<button className="add" onClick={() => methods.create(type)}>add</button>
		</div>
	</div>
}