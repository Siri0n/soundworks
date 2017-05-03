var React = require("react");
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = function({view, methods}){
	return <div> 
		{view.get("listOrder").map(type => {
			return <NodeList key={type}
				Node={NodesUI[type]}
				{...{
					type,
					view,
					methods
				}}
			/>
		})}
	</div>
}