var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");
var util = require("./util.js");

module.exports = function({id, type, connecting, connections, nodes, waves, data, 
	methods: {remove, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)} /> 
		<Param param="frequency" name="Frequency" value={data.get("frequency")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<Param param="detune" name="Detune" value={data.get("detune")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<div className="audio-param">
			<span>Type: </span>
			<select defaultValue={data.get("type")} onChange={e => modify(id, "type", e.target.value)}>
				<option value="sine">sine</option>
				<option value="sawtooth">sawtooth</option>
				<option value="square">square</option>
				<option value="triangle">triangle</option>
				{waves.map(id => {
					return <option key={id} value={id}>{"(custom)" + nodes.getIn([id, "name"])}</option>
				})}
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