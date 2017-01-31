var React = require("react");
var ListManager = require("./listManager.jsx");
var Synthesizer = require("./synthesizer.jsx");
var Editor = require("./editor.jsx");
var Out = require("./out.jsx");
var Exports = require("./exports.jsx");
var connect = require("react-redux").connect;


module.exports = connect(
	state => ({state}),
	dispatch => {
		return {
			methods:{
				toggleCollapsed(list){
					dispatch({type: "TOGGLE_COLLAPSED", list})
				},
				create(nodeType){
					dispatch({type: "CREATE_NODE", nodeType});		
				},
				remove(id){
					dispatch({type: "DELETE_NODE", id});
				},
				modify(id, key, value){
					dispatch({type: "MODIFY", id, key, value});
				},
				modifyDeep(id, path, value){
					dispatch({type: "MODIFY", id, path, value});
				},
				connectFrom(id){
					dispatch({type: "CONNECT_FROM", id});
				},
				connectTo(id, param){
					dispatch({type: "CONNECT_TO", id, param});
				},
				connectAbort(){
					dispatch({type: "CONNECT_ABORT"});
				},
				connectRemove(id, key){
					dispatch({type: "CONNECT_REMOVE", id, key});
				},
				connectSelect(id, key){
					dispatch({type: "CONNECT_SELECT", id, key});
				},
				editCustomNode(id){
					dispatch({type: "EDIT_CUSTOM", id});
				},
				closeCustomNode(){
					dispatch({type: "EDIT_CUSTOM_END"})
				},
				openEditor(id){
					dispatch({type: "EDIT_INSTRUCTIONS", id});
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
		while(view.get("scope")){
			view = view.getIn(view.get("scope"))
		}

		var type = view.get("nodeType");
		if(type == "root"){
			return <div> 
				<ListManager state={view} methods={methods}/>
				<Out connecting={view.get("connecting")} connectTo={methods.connectTo.bind(null, "0", null)}/>
				<Synthesizer state={view} togglePlaying={methods.togglePlaying}/>
				<Editor state={view} edit={methods.modify} closeEditor={methods.closeEditor}/>
			</div>
		}else if(type == "custom"){
			return <div> 
				<ListManager state={view} methods={methods}/>
				<Out connecting={view.get("connecting")} connectTo={methods.connectTo.bind(null, "0", null)}/>
				<Exports state={view} methods={methods}/>
			</div>
		}else{
			return <div>Something goes wrong... Type is {type}</div>
		}
	}
);