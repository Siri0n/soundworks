var Redux = require("redux");

const initState = {
	oscillators: []
}

var store = module.exports = Redux.createStore(oscillator, initState);

function oscillator(state, command){
	if(command.type == "ADD"){
		var o = {
			name: uniqueName("o", state.oscillators.map(elem => elem.name))
		}
		return Object.assign(
			{}, 
			state, 
			{
				oscillators: state.oscillators.concat([o])
			}
		)
	}else if(command.type == "REMOVE"){
		return Object.assign(
			{}, 
			state, 
			{
				oscillators: state.oscillators.filter(o => o.name != command.name)
			}
		)
	}else if(command.type == "MODIFY"){
		return Object.assign(
			{}, 
			state, 
			{
				oscillators: state.oscillators.map(function(o){
					if(o.name == command.name){
						return Object.assign({}, o, {[command.key]: command.value});
					}else{
						return o;
					}
				})
			}
		)
	}else{
		return state;
	}
}

function uniqueName(prefix, existingNames){
	var i = 1;
	while(existingNames.includes(prefix + i++));
	return prefix + -- i;
}