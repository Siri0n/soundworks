var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, nodes, connecting, data, 
	methods: {openEditor, remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	console.log(id, type, data);
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)} /> 
		<Param param="bar" name="Bar" value={data.get("bar")} 
			connectable={false}
			modify={modify.bind(null, id)}/>
		<button onClick={openEditor.bind(null, id)}>Edit instructions</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			nodes={nodes}
			select={connectSelect.bind(null, id)}
			remove={connectRemove.bind(null, id)}/>
	</div>
}