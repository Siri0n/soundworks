var React = require("react");
var connect = require("react-redux").connect;
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = connect(
	function({nodes}){
		return {nodes};
	},
	function(dispatch){
		return {
			add(nodeType){
				dispatch({type: "ADD", nodeType});		
			},
			remove(nodeType, name){
				dispatch({type: "REMOVE", nodeType, name});
			},
			modify(nodeType, name, key, value){
				console.log(name, key, value)
				dispatch({type: "MODIFY", nodeType, name, key, value});
			}
		}
	}
)(
	function({nodes, add, remove, modify, types}){
		return <div> 
			{types.map(function(type){
				return <NodeList 
					key={type} 
					items={nodes[type]}
					Node={NodesUI[type]}
					add={add.bind(null, type)}
					remove={remove.bind(null, type)}
					modify={modify.bind(null, type)}
				/>
			})}
		</div>
	}
)