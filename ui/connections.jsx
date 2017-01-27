var React = require("react");

module.exports = function({connections, nodes, select, remove}){
	return <div className="connections">
		Connected to:
		<select value={connections.get("selected") || ""} onChange={() => select(event.target.value)}>
			{connections.get("order").map(key => {
				var elem = connections.getIn(["data", key]);
				var name = nodes.get(elem.get("id")).get("name");
				var param = elem.get("param");
				return <option key={key} value={key}>{name + (param ? "." + param : "")}</option>
			})}
		</select>
		<button disabled={!connections.get("selected")} 
			onClick={() => remove(connections.get("selected"))}>X</button>
	</div>
}