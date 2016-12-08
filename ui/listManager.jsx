var React = require("react");
var connect = require("react-redux").connect;
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = connect(
	function({nodes, connecting}){
		return {nodes, connecting};
	},
	function(dispatch){
		return {
			methods: {
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
					dispatch({type: "CONNECT_TO", id, param});
				},
				connectAbort(){
					dispatch({type: "CONNECT_ABORT"});
				}
			}
		}
	}
)(
	function({nodes, connecting, methods, types}){
		return <div> 
			{types.map(function(type){
				return <NodeList 
					key={type}
					items={nodes[type]}
					Node={NodesUI[type]}
					{
						...{
							type,
							methods,
							connecting
						}
					}
				/>
			})}
		</div>
	}
)