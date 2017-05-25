var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, data, nodes, connecting, connections,
	methods: {remove, rename, connectFrom, connectTo, connectAbort, connectRemove, connectSelect, connectRename, openEditor}
}){
	var scId = data.get("selectedConnection");
	var name = scId && connections.find(
		([id, c]) => id == scId
	)[1].get("name") || "";
	console.log("name", connections.getIn([scId, "name"]));
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={connecting && connecting.get("id") != id && 
				(connecting.get("type") == "code" || connecting.get("type") == "transformer" || connecting.get("type") == "exports")}
			connectTo={connectTo.bind(null, id, null)}
			remove={remove.bind(null, id)}
			rename={rename.bind(null, id)}/> 
		<button onClick={openEditor.bind(null, id)}>Edit</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={connections}
			selected={data.get("selectedConnection")}
			nodes={nodes} 
			select={connectSelect}
			remove={connectRemove}/>
		{scId && <input type="text" value={name}
			onChange={e => connectRename(scId, e.target.value)}>
		</input>}
	</div>
}