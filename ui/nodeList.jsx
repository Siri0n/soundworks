var React = require("react");

module.exports = function({items, Node, type, methods, connecting}){
	return <div>
		{items.map(elem => 
			<Node key={elem.id} data={elem} {...{type, methods, connecting}}/>
		)}
		<button onClick={() => methods.add(type)}>add</button>
	</div>
}