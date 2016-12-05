var React = require("react");

module.exports = function({items, Node, add, remove, modify}){
	return <div>
		{items.map(o => 
			<Node key={o.name} data={o} remove={remove.bind(null, o.name)} modify={modify.bind(null, o.name)}/>
		)}
		<button onClick={add}>add</button>
	</div>
}