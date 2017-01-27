var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, nodes, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={connecting && connecting.get("id") != id && connecting.get("type") != "instructions"}
			remove={remove.bind(null, id)} 
			connectTo={connectTo.bind(null, id, null)}/> 
		<Param param="gain" 
			name="Gain" 
			value={data.get("gain")}
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			nodes={nodes} 
			select={connectSelect.bind(null, id)}
			remove={connectRemove.bind(null, id)}/>
	</div>
}