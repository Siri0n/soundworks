var React = require("react");

module.exports = function({data:{id, gain, connect}, type, connecting, methods: {remove, modify, connectFrom, connectTo, connectAbort}}){
	return <div className="audio-node">
		<div className={connecting ? " hidden" : ""}>
			<div>
				<span className="name">{id}</span>
				<span className="close" onClick={() => remove(type, id)}>x</span>
			</div>
			<input type="text" defaultValue={gain} onChange={e => modify(type, id, "gain", e.target.value)}/>
			<button onClick={() => connectFrom(type, id)}>Connect</button>
			{connect ?
			<div className="connections">
				<span>Connected to:</span>
				{connect.map((elem, index) => <span key={index}>{elem.id + (elem.param ? "." + elem.param : "")}</span>)}
			</div> : null}
		</div>
		{connecting ? 
		<div className="connect">
			{connecting.id == id ?
			<button onClick={connectAbort}>Cancel</button> :
			<div>
				<button onClick={() => connectTo(type, id)}>node</button>
				<button onClick={() => connectTo(type, id, "gain")}>gain</button>
			</div>
			}
		</div>: 
		null
		}
	</div>
}