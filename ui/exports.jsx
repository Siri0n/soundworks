var React = require("react");
var Immutable = require("immutable");

function Export({name, keyname, rename, remove}){
	return <div>
		{keyname} as
		<input type="text" value={name} onChange={e => rename(e.target.value)}/>
		<span className="close" onClick={remove}>x</span>
	</div>
} 

module.exports = function({state, methods: {connectRename, connectRemove, connectAbort, connectFrom, closeCustomNode}}){
	var connections = state.get("connections")
		.filter(c => c.getIn(["from", "id"]) == "-1")
		.entrySeq()
		.sort((c1, c2) => c1[0] - c2[0]);

	var connecting = state.get("connecting");
	return <div className="exports">
		{connecting && (connecting.get("id") == "-1") ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom("-1")}>Export</button>}
		<button onClick={closeCustomNode}>Close</button>
		{connections.map(([id, c]) => {
			var toNode = state.getIn(["nodes", c.getIn(["to", "id"])]);
			var nodeName = toNode.get("name");
			var param = c.getIn(["to", "param"]);
			var paramName;
			if(toNode.get("nodeType") == "custom"){
				paramName = toNode.getIn(["connections", param, "name"]);
			}else{
				paramName = param;
			}
			var keyname = [nodeName, paramName].join(".");
			return <Export key={id} name={c.get("name")} id={id} keyname={keyname}
				rename={connectRename.bind(null, id)}
				remove={connectRemove.bind(null, id)}/>
		})}
	</div>
}