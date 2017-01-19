var React = require("react");

module.exports = function({state, edit, close}){
	return <div className={state.get("edit") ? "editor" : "hidden"}>
		<div className="editor-close" onClick={close}>X</div>
		<textarea 
			onChange={e => edit("instructions", state.getIn(["edit", "id"]), "text", e.target.value)}
			value={state.getIn(["lists", "instructions", "nodes", state.getIn(["edit", "id"]), "text"])}/>
	</div>
}