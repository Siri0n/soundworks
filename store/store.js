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
			id: uniqueId(nodeType, state.nodes[nodeType].map(elem => elem.id))
		}
	}
}

function uniqueId(prefix, existingIds){
	var i = 1;
	while(existingIds.includes(prefix + i++));
	return prefix + --i;
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
						[command.nodeType]: state.nodes[command.nodeType].filter(n => n.id != command.id)
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
							if(o.id == command.id){
								return Object.assign({}, o, {[command.key]: command.value});
							}else{
								return o;
							}
						})
					})
			}
		)
	}else if(command.type == "TOGGLE_PLAYING"){
		return Object.assign({}, state, {playing: !state.playing});
	}else if(command.type == "CONNECT_FROM"){
		return Object.assign({}, state, {connecting: {id: command.id, nodeType: command.nodeType}});
	}else if(command.type == "CONNECT_TO"){
		console.log(state.connecting);
		return Object.assign(
			{}, 
			state, 
			{
				connecting: null,
				nodes: Object.assign(
					{}, 
					state.nodes, 
					{
						[state.connecting.nodeType]: state.nodes[state.connecting.nodeType].map(function(o){
							if(o.id == state.connecting.id){
								return Object.assign(
									{}, 
									o, 
									{
										connect: (o.connect || []).concat(
											[{id: command.id, param: command.param}]
										)
									}
								);
							}else{
								return o;
							}
						})
					})
			}
		)
	}else if(command.type == "CONNECT_ABORT"){
		return Object.assign({}, state, {connecting: null});
	}else{
		return state;
	}
}