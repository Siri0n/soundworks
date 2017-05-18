var React = require("react");
var ListManager = require("./listManager.jsx");
var Synthesizer = require("./synthesizer.jsx");
var Editor = require("./editor.jsx");
var Out = require("./out.jsx");
var SaveLoad = require("./saveload.jsx");
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
				setCustomParam(id, connectionId, value){
					dispatch({type: "MODIFY_CUSTOM", id, connectionId, value});
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
				connectRemove(connectionId){
					dispatch({type: "CONNECT_REMOVE", connectionId});
				},
				connectRename(connectionId, name){
					dispatch({type: "CONNECT_RENAME", connectionId, name});
				},
				connectSelect(connectionId){
					dispatch({type: "CONNECT_SELECT", connectionId});
				},
				editCustomNode(id){
					dispatch({type: "EDIT_CUSTOM", id});
				},
				closeCustomNode(){
					dispatch({type: "EDIT_CUSTOM_END"});
				},
				openEditor(id){
					dispatch({type: "EDIT_TEXT", id});
				},
				closeEditor(){
					dispatch({type: "EDIT_TEXT_END"});
				},
				togglePlaying(){
					dispatch({type: "TOGGLE_PLAYING"});
				},
				load(data){
					dispatch({type: "LOAD", data});
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
			return <div className="columns"> 
				<ListManager view={view} methods={methods}/>
				<Out connecting={view.get("connecting")} connectTo={methods.connectTo.bind(null, "0", null)}/>
				<Synthesizer state={view} togglePlaying={methods.togglePlaying}/>
				<Editor state={view} edit={methods.modify} closeEditor={methods.closeEditor}/>
			</div>
		}else if(type == "custom"){
			return <div className="columns"> 
				<ListManager view={view} methods={methods}/>
				<Out connecting={view.get("connecting")} connectTo={methods.connectTo.bind(null, "0", null)}/>
				<Exports state={view} methods={methods}/>
				<SaveLoad state={view} load={methods.load}/>
			</div>
		}else{
			return <div>Something goes wrong... Type is {type}</div>
		}
	}
);