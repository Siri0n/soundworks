var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");
var util = require("./util.js");

module.exports = function({id, type, connecting, connections, nodes, waves, data, 
	methods: {remove, rename, modify, connectFrom, connectTo, connectAbort, connectRemove, connectSelect}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={util.connectable.audioNode(id, connecting)}
			remove={remove.bind(null, id)}
			rename={rename.bind(null, id)}
			connectTo={connectTo.bind(null, id, null)}/> 
		<Param param="frequency" name="Frequency" value={data.get("frequency")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<Param param="detune" name="Detune" value={data.get("detune")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<Param param="Q" name="Q-factor" value={data.get("Q")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<Param param="gain" name="Gain" value={data.get("gain")} 
			connectable={util.connectable.audioParam(id, connecting)}
			connectTo={connectTo.bind(null, id)}
			modify={modify.bind(null, id)}/>
		<div className="audio-param">
			<span>Type: </span>
			<select defaultValue={data.get("type")} onChange={e => modify(id, "type", e.target.value)}>
				<option value="lowpass">lowpass</option>
				<option value="highpass">highpass</option>
				<option value="bandpass">bandpass</option>
				<option value="lowshelf">lowshelf</option>
				<option value="highshelf">highshelf</option>
				<option value="peaking">peaking</option>
				<option value="notch">notch</option>
				<option value="allpass">allpass</option>
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