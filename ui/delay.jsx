var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, nodes, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={connecting && connecting.get("id") != id && connecting.get("nodeType") != "instructions"}
			connectTo={connectTo.bind(null, id, null)}
			remove={remove.bind(null, id)} /> 
		<Param param="delayTime" name="Delay time" value={data.get("delayTime")} 
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<Param param="maxDelay" name="Max. delay" value={data.get("maxDelay")} 
			connectable={false}
			modify={modify.bind(null, id)}/>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			nodes={nodes} 
			select={connectSelect.bind(null, id)}
			remove={connectRemove.bind(null, id)}/>
	</div>
}