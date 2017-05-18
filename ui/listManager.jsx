var React = require("react");
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = function({view, methods}){
	var visibleLists = view.get("listOrder").filter(type => !view.getIn(["lists", type, "collapsed"]));
    var hiddenLists = view.get("listOrder").filter(type => view.getIn(["lists", type, "collapsed"]));
	return <div>
		{hiddenLists.size ? <div className="hiddenLists">
		    {"Hidden lists:   "}
			{hiddenLists.map(type => {
				return <span key={type} onClick={() => methods.toggleCollapsed(type)}>
					{type + " nodes"}
				</span>
			})}
		</div> : null} 
		<div className="columns"> 
			{visibleLists.map(type => {
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
	</div>
}