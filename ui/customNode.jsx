var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, names, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect, editCustomNode}
}){
	return <div className="audio-node">
		<Header name={names.get(id)}
			connectable={false}
			remove={remove.bind(null, type, id, null)}/>

		{data.getIn(["lists", "input", "ids"]).map(inputId => {
			return 	<Param key={inputId} param={inputId} 
				name={data.get("names").get(inputId)} 
				value={data.getIn(["lists", "input", "nodes", inputId, "offset"])} 
				connectable={connecting && connecting.get("id") != id}
				connectTo={connectTo.bind(null, type, id)}
				modify={modify.bind(null, type, id)}/>
		})}
		<button onClick={() => editCustomNode(type, id)}>Edit</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom(type, id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			names={names} 
			select={connectSelect.bind(null, type, id)}
			remove={connectRemove.bind(null, type, id)}/>
	</div>
}