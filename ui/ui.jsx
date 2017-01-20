var React = require("react");
var ListManager = require("./listManager.jsx");
var Synthesizer = require("./synthesizer.jsx");
var Editor = require("./editor.jsx");
var Out = require("./out.jsx");
var connect = require("react-redux").connect;

/*module.exports = function(){
	return <div>
		<ListManager/>
		<Synthesizer/>
		<Editor/>
		<Text/>
	</div>
}	*/


module.exports = connect(
	state => ({state}),
	dispatch => {
		return {
			methods:{
				toggleCollapsed(nodeType){
					dispatch({type: "TOGGLE_COLLAPSED", nodeType})
				},
				add(nodeType){
					dispatch({type: "ADD", nodeType});		
				},
				remove(nodeType, id){
					dispatch({type: "REMOVE", nodeType, id});
				},
				modify(nodeType, id, key, value){
					dispatch({type: "MODIFY", nodeType, id, key, value});
				},
				connectFrom(nodeType, id){
					dispatch({type: "CONNECT_FROM", nodeType, id});
				},
				connectTo(nodeType, id, param){
					dispatch({type: "CONNECT_TO", nodeType, id, param});
				},
				connectAbort(){
					dispatch({type: "CONNECT_ABORT"});
				},
				connectRemove(nodeType, id, key){
					dispatch({type: "CONNECT_REMOVE", nodeType, id, key});
				},
				connectSelect(nodeType, id, key){
					dispatch({type: "CONNECT_SELECT", nodeType, id, key});
				},
				editCustomNode(nodeType, id){
					dispatch({type: "EDIT_CUSTOM", nodeType, id});
				},
				openEditor(nodeType, id){
					dispatch({type: "EDIT_INSTRUCTIONS", nodeType, id});
				},
				closeEditor(){
					dispatch({type: "EDIT_INSTRUCTIONS_END"});
				},
				togglePlaying(){
					dispatch({type: "TOGGLE_PLAYING"});
				}
			}
		}
	}
)(
	function({state, methods}){
		var view = state;
		while(view.getIn(["view", "scope"])){
			view = view.getIn(view.getIn(["view", "scope"]))
		}

		if(view.getIn(["view", "type"]) == "root"){
			return <div> 
				<ListManager state={view} methods={methods}/>
				<Out connecting={view.get("connecting")} connectTo={methods.connectTo.bind(null, "out", "0", null)}/>
				<Synthesizer state={view} togglePlaying={methods.togglePlaying}/>
				<Editor state={view} edit={methods.modify} closeEditor={methods.closeEditor}/>
			</div>
		}else if(view.getIn(["view", "type"]) == "custom"){
			return <div> 
				<ListManager state={view} methods={methods}/>
			</div>
		}else{
			return <div>Something goes wrong...</div>
		}
	}
);