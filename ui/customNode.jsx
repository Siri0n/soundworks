var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

function join_(arg1, arg2){
	return arg1 + (arg2 ? ("_" + arg2) : "");
}

module.exports = function({id, type, nodes, connecting, data, 
	methods: {remove, modifyDeep, connectFrom, connectTo, connectAbort, connectRemove, connectSelect, editCustomNode}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)}/>

		{data.getIn(["nodes", "-1", "connections", "order"]).map(key => {
			var [exportId, param] = key.split(".");
			var connectable = connecting && connecting.get("id") != id;
			var name = data.getIn(["nodes", "-1", "connections", "data", key, "name"]);
			return <div className="audio-param" key={key}>
				<span className={connectable ? "highlighted" : ""} 
					onClick={connectable ? connectTo.bind(null, id, join_(exportId, param)) : null}>
					{name + (param ? ": " : "")}
				</span>
				{param && <input type="text" defaultValue={data.getIn(["nodes", exportId, param])} 
					onChange={e => modifyDeep(id, ["nodes", exportId, param], e.target.value)}/>}
			</div>
		})}
		<button onClick={() => editCustomNode(id)}>Edit</button>
		{connecting && (connecting.get("id") == id) ?
		<button onClick={connectAbort}>Cancel</button>:
		<button onClick={() => connectFrom(id)}>Connect</button>}
		<Connections connections={data.get("connections")} 
			nodes={nodes} 
			select={connectSelect.bind(null, id)}
			remove={connectRemove.bind(null, id)}/>
	</div>
}