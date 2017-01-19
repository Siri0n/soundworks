var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, names, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={names.get(id)}
			connectable={connecting && connecting.get("id") != id && connecting.get("nodeType") != "instructions"}
			remove={remove.bind(null, type, id)} 
			connectTo={connectTo.bind(null, type, id, null)}/> 
		<Param param="gain" 
			name="Gain" 
			value={data.get("gain")}
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, type, id)}
			modify={modify.bind(null, type, id)}/>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom(type, id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			names={names} 
			select={connectSelect.bind(null, type, id)}
			remove={connectRemove.bind(null, type, id)}/>
	</div>
}