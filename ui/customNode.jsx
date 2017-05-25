var React = require("react");
var Header = require("./header.jsx");
var Connections = require("./connections.jsx");
var Param = require("./param.jsx");

function getParamValue(data, id, param){
	var node = data.getIn(["nodes", id]);
	if(node.get("nodeType") != "custom"){
		return node.get(param);
	}else{
		let c = node.getIn(["connections", param]).toJS();
		console.log(c);
		return getParamValue(node, c.to.id, c.to.param);
	}
}

module.exports = function({id, type, data, nodes, connecting, connections, 
	methods: {remove, rename, setCustomParam, connectFrom, connectTo, connectAbort, connectRemove, connectSelect, editCustomNode}
}){
	var exports = data.get("connections")
		.filter(c => c.getIn(["from", "id"]) == "-1")
		.entrySeq()
		.sort((c1, c2) => c1[0] - c2[0]);

	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)}
			rename={rename.bind(null, id)}/>

		{exports.map(([cid, c]) => {
			var connectable = connecting && connecting.get("id") != id;
			var name = c.get("name");
			var toId = c.getIn(["to", "id"]);
			var param = c.getIn(["to", "param"]);
			return <div className="audio-param" key={cid}>
				<span className={connectable ? "highlighted" : ""} 
					onClick={connectable ? connectTo.bind(null, id, cid) : null}>
					{name + (param ? ": " : "")}
				</span>
				{param && <input type="text" defaultValue={getParamValue(data, toId, param)} 
					onChange={e => setCustomParam(id, cid, e.target.value)}/>}
			</div>
		})}
		<button onClick={() => editCustomNode(id)}>Edit</button>
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