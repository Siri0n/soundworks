var React = require("react");
var NodeList = require("./nodeList.jsx");
var NodesUI = require("./nodesUI");

module.exports = function({state, methods}){
	return <div> 
		{state.get("order").map(type => {
			var waves;
			if(type == "oscillator"){
				waves = state.getIn(["lists", "periodicWave"]);
			}
			return <NodeList key={type}
				data={state.getIn(["lists", type])}
				names={state.get("names")}
				Node={NodesUI[type]}
				connecting={state.get("connecting")}
				{...{
					type, 
					methods,
					waves
				}}
			/>
		})}
	</div>
}