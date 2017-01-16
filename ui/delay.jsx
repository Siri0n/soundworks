var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, names, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectionSelect}
}){
	return <div className="audio-node">
		<Header name={names.get(id)}
			connectable={connecting && connecting.get("id") != id && connecting.get("nodeType") != "instructions"}
			connectTo={connectTo.bind(null, type, id, null)}
			remove={remove.bind(null, type, id, null)} /> 
		<Param param="delayTime" name="Delay time" value={data.get("delayTime")} 
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, type, id)}
			modify={modify.bind(null, type, id)}/>
		<Param param="maxDelay" name="Max. delay" value={data.get("maxDelay")} 
			connectable={false}
			modify={modify.bind(null, type, id)}/>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(type, id)}>Connect</button>}
		<Connections connections={data.get("connections")} names={names} select={connectionSelect.bind(null, type, id)}/>
	</div>
}