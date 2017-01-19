var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, names, connecting, data, 
	methods: {openEditor, remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={names.get(id)}
			connectable={false}
			remove={remove.bind(null, type, id, null)} /> 
		<Param param="bar" name="Bar" value={data.get("bar")} 
			connectable={false}
			modify={modify.bind(null, type, id)}/>
		<button onClick={openEditor.bind(null, type, id)}>Edit instructions</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(type, id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			names={names} 
			select={connectSelect.bind(null, type, id)}
			remove={connectRemove.bind(null, type, id)}/>
	</div>
}