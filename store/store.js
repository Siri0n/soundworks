var Redux = require("redux");

const initState = {
	nodes:{
		oscillator: []
	}
}

var store = module.exports = Redux.createStore(oscillator, initState);

function createNode(state, nodeType){
	if(nodeType == "oscillator"){
		return {
			frequency: 500,
			name: uniqueName(nodeType, state.nodes[nodeType].map(elem => elem.name))
		}
	}
}

function uniqueName(prefix, existingNames){
	var i = 1;
	while(existingNames.includes(prefix + i++));
	return prefix + -- i;
}

function oscillator(state, command){
	if(command.type == "ADD"){
		var n = createNode(state, command.nodeType);
		return Object.assign(
			{}, 
			state, 
			{
				nodes: Object.assign(
					{}, 
					state.nodes, 
					{
						[command.nodeType]: state.nodes[command.nodeType].concat(n)
					})
			}
		)
	}else if(command.type == "REMOVE"){
		return Object.assign(
			{}, 
			state, 
			{
				nodes: Object.assign(
					{}, 
					state.nodes, 
					{
						[command.nodeType]: state.nodes[command.nodeType].filter(n => n.name != command.name)
					})
			}
		)
	}else if(command.type == "MODIFY"){
		return Object.assign(
			{}, 
			state, 
			{
				nodes: Object.assign(
					{}, 
					state.nodes, 
					{
						[command.nodeType]: state.nodes[command.nodeType].map(function(o){
							if(o.name == command.name){
								return Object.assign({}, o, {[command.key]: command.value});
							}else{
								return o;
							}
						})
					})
			}
		)
	}else{
		return state;
	}
}