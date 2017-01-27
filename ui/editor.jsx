var React = require("react");

module.exports = function({state, edit, closeEditor}){
	return <div className={state.get("edit") ? "editor" : "hidden"}>
		<div className="editor-close" onClick={closeEditor}>X</div>
		<textarea 
			onChange={e => edit(state.get("edit"), "text", e.target.value)}
			value={state.getIn(["nodes", state.get("edit"), "text"])}/>
	</div>
}