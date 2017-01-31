var React = require("react");

function join(arg1, arg2){
	return arg1 + (arg2 ? ("." + arg2) : "");
}

function Export({name, keyname, rename, remove}){
	return <div>
		{keyname} as
		<input type="text" value={name} onChange={e => rename(e.target.value)}/>
		<span className="close" onClick={remove}>x</span>
	</div>
} 

module.exports = function({state, methods: {modifyDeep, connectRemove, connectAbort, connectFrom, closeCustomNode}}){
	var connections = state.getIn(["nodes", "-1", "connections"]);
	var connecting = state.get("connecting")
	return <div className="exports">
		{connecting && (connecting.get("id") == "-1") ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom("-1")}>Export</button>}
		<button onClick={closeCustomNode}>Close</button>
		{connections.get("order").map(key => {
			var data = connections.getIn(["data", key]);
			var nodeName = state.getIn(["nodes", data.get("id"), "name"]);
			var keyname = join(nodeName, data.get("param"));
			return <Export name={data.get("name")} key={key} keyname={keyname}
				rename={modifyDeep.bind(null, "-1", ["connections", "data", key, "name"])}
				remove={connectRemove.bind(null, "-1", key)}/>
		})}
	</div>
}