var React = require("react");
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = function({state, methods}){
	return <div> 
		{state.get("listOrder").map(type => {
			return <NodeList key={type}
				Node={NodesUI[type]}
				{...{
					type,
					state,
					methods
				}}
			/>
		})}
	</div>
}