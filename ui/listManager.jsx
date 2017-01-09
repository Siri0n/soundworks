var React = require("react");
var connect = require("react-redux").connect;
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = connect(
	function(state){
		return {state}

	},
	function(dispatch){
		return {
			methods: {
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
				connectionSelect(nodeType, id, key){
					dispatch({type: "CONNECTION_SELECT", nodeType, id, key});
				}
			}
		}
	}
)(
	function({state, methods}){
		return <div> 
			{state.get("order").map(type => {
				return <NodeList key={type}
					data={state.getIn(["lists", type])}
					names={state.get("names")}
					Node={NodesUI[type]}
					connecting={state.get("connecting")}
					{...{
						type, 
						methods
					}}
				/>
			})}
		</div>
	}
);