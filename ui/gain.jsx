var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");
var util = require("./util.js");

module.exports = function({id, type, data, nodes, connecting, connections,
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={util.connectable.audioNode(id, connecting)}
			remove={remove.bind(null, id)} 
			connectTo={connectTo.bind(null, id, null)}/> 
		<Param param="gain" 
			name="Gain" 
			value={data.get("gain")}
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={connections}
			selected={data.get("selectedConnection")}
			nodes={nodes} 
			select={connectSelect}
			remove={connectRemove}/>
	</div>
}