var React = require("react");

module.exports = function({connections, names, select}){
	return <div className="connections">
		Connected to:
		<select defaultValue={connections.get("selected")} onChange={() => select(event.target.value)}>
			{connections.get("order").map(key => {
				var elem = connections.getIn(["data", key]);
				var name = names.get(elem.get("id"));
				var param = elem.get("param");
				return <option key={key} value={key}>{name + (param ? "." + param : "")}</option>
			})}
		</select>
		<button disabled={!connections.get("selected")} 
			onClick={() => this.props.connectRemove(...connections.get("selected").split("."))}>X</button>
	</div>
}