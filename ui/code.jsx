var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, data, nodes, connecting, connections,
	methods: {remove, connectFrom, connectAbort, connectRemove, connectSelect, openEditor}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)} /> 
		<button onClick={openEditor.bind(null, id)}>Edit</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={connections}
			selected={data.get("selectedConnection")}
			nodes={nodes} 
			select={connectSelect}
			remove={connectRemove}/>
	</div>
}