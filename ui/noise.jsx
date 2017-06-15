var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, connecting, connections, nodes, data, 
	methods: {remove, rename, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)}
			rename={rename.bind(null, id)} /> 
		<div className="audio-param">
			<span>Type: </span>
			<select defaultValue={data.get("type")} onChange={e => modify(id, "type", e.target.value)}>
				<option value="white">white</option>
				<option value="pink">pink</option>
				<option value="brown">brown</option>
			</select>
		</div>
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