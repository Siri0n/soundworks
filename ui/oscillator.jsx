var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

module.exports = function({id, type, names, waves, connecting, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectionSelect}
}){
	return <div className="audio-node">
		<Header name={names.get(id)}
			connectable={false}
			remove={remove.bind(null, type, id, null)} /> 
		<Param param="frequency" name="Frequency" value={data.get("frequency")} 
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, type, id)}
			modify={modify.bind(null, type, id)}/>
		<Param param="detune" name="Detune" value={data.get("detune")} 
			connectable={connecting && connecting.get("id") != id}
			connectTo={connectTo.bind(null, type, id)}
			modify={modify.bind(null, type, id)}/>
		<div className="audio-param">
			<span>Type: </span>
			<select defaultValue={data.get("type")} onChange={e => modify(type, id, "type", e.target.value)}>
				<option value="sine">sine</option>
				<option value="sawtooth">sawtooth</option>
				<option value="square">square</option>
				<option value="triangle">triangle</option>
				{waves.get("ids").map(id => {
					return <option key={id} value={id}>{"(custom)" + names.get(id)}</option>
				})}
			</select>
		</div>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={() => connectAbort()}>Cancel</button>:
		<button onClick={() => connectFrom(type, id)}>Connect</button>}
		<Connections connections={data.get("connections")} names={names} select={connectionSelect.bind(null, type, id)}/>
	</div>
}