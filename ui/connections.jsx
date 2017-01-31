var React = require("react");

module.exports = function({connections, nodes, select, remove}){
	return <div className="connections">
		Connected to:
		<select value={connections.get("selected") || ""} onChange={() => select(event.target.value)}>
			{connections.get("order").map(key => {
				var elem = connections.getIn(["data", key]);
				var name = nodes.get(elem.get("id")).get("name");
				var param = elem.get("param");
				var paramName = param;
				if(nodes.getIn([elem.get("id"),"nodeType"]) == "custom"){
					paramName = nodes.getIn([elem.get("id"), "nodes", "-1", "connections", "data", param.replace("_", "."), "name"]);
				}
				return <option key={key} value={key}>{name + (paramName ? "." + paramName : "")}</option>
			})}
		</select>
		<button disabled={!connections.get("selected")} 
			onClick={() => remove(connections.get("selected"))}>X</button>
	</div>
}