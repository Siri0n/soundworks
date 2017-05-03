var React = require("react");

module.exports = function({connections, selected, nodes, select, remove}){
	return <div className="connections">
		Connected to:
		<select value={selected === null ? "" : selected} onChange={e => select(e.target.value)}>
			{connections.map(([id, c]) => {
				var toId = c.getIn(["to", "id"]);
				var name = nodes.getIn([toId, "name"]);
				var toParam = c.getIn(["to", "param"]);
				var fromParam = c.getIn(["from", "param"]);
				var paramName = toParam;

				if(nodes.getIn([toId, "nodeType"]) == "custom"){
					paramName = nodes.getIn([toId, "connections", toParam, "name"]);
				}
				return <option key={id} value={id}>
					{(fromParam ? "[" + fromParam + "]" : "") + name + (paramName ? "." + paramName : "")}
				</option>
			})}
		</select>
		<button disabled={!selected} 
			onClick={() => remove(selected)}>X</button>
	</div>
}