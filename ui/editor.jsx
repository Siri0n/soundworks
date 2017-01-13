var React = require("react");
var connect = require("react-redux").connect;

module.exports = connect(
	function(state){
		return {state}
	},
	function(dispatch){
		return {
			edit(nodeType, id, key, value){
				dispatch({type: "MODIFY", nodeType, id, key, value});
			},
			close(){
				dispatch({type: "EDIT_END"});
			}
		}
	}
)(function({state, edit, close}){
	return <div className={state.get("edit") ? "editor" : "hidden"}>
		<div className="editor-close" onClick={close}>X</div>
		<textarea 
			onChange={e => edit("instructions", state.getIn(["edit", "id"]), "text", e.target.value)}
			value={state.getIn(["lists", "instructions", "nodes", state.getIn(["edit", "id"]), "text"])}/>
	</div>
})