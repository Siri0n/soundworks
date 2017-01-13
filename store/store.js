var Redux = require("redux");
var Immutable = require("immutable");

const initState = Immutable.fromJS({
	lists:{
		oscillator: {
			collapsed: false,
			ids: [],
			nodes: {}
		},
		gain: {
			collapsed: false,
			ids: [],
			nodes: {}
		},
		periodicWave: {
			collapsed: true,
			ids: [],
			nodes: {}
		},
		instructions: {
			collapsed: false,
			ids: [],
			nodes: {}
		}
	},
	names: {},
	order: ["instructions", "periodicWave", "oscillator", "gain"],
	edit: null,
	playing: false,
	connecting: null,
	lastId: 0
});

var store = module.exports = Redux.createStore(reducer, initState);

function createNode(names, nodeType){
	var result, name;
	if(nodeType == "oscillator"){
		result = {
			frequency: 500,
			detune: 0,
			type: "sine"
		}
		name = uniqueName(names, "Oscillator");
	}else if(nodeType == "gain"){
		result = {
			gain: 1
		}
		name = uniqueName(names, "Gain");
	}else if(nodeType == "periodicWave"){
		result = {
			coefs: [
				[1, 0]
			]
		}
		name = uniqueName(names, "Wave");
	}else if(nodeType == "instructions"){
		result = {
			text: "",
			bar: 1
		}
		name = uniqueName(names, "Instructions");
	}
	if(nodeType != "PeriodicWave"){
		result.connections = {order:[], data: {}, selected: null};
	}
	return [Immutable.fromJS(result), name];
}

function uniqueName(names, prefix){
	var i = 0;
	while(names.includes(prefix + ++i));
	return prefix + i;
}

function reducer(state, command){
	console.log(command);

	if(command.type == "TEST"){
		state = Immutable.fromJS(state.toJS());
	}else if(command.type == "SET_STATE"){
		state = Immutable.fromJS(command.data);
	}else if(command.type == "TOGGLE_COLLAPSED"){
		state = state.updateIn(["lists", command.nodeType, "collapsed"], b => !b);
	}else if(command.type == "ADD"){
		var [node, name] = createNode(state.get("names"), command.nodeType);
		console.log(name);
		var id = state.get("lastId") + 1 + "";
		state = state.set("lastId", id);
		state = state.setIn(["lists", command.nodeType, "nodes", id], node);
		state = state.updateIn(["lists", command.nodeType, "ids"], list => list.push(id));
		state = state.setIn(["names", id], name);

	}else if(command.type == "REMOVE"){
		state = state.deleteIn(["lists", command.nodeType, "nodes", command.id]);
		state = state.updateIn(["lists", command.nodeType, "ids"], list => list.filter(id => id != command.id));

	}else if(command.type == "MODIFY"){
		state = state.setIn(["lists", command.nodeType, "nodes", command.id, command.key], command.value);

	}else if(command.type == "TOGGLE_PLAYING"){
		state = state.update("playing", b => !b);

	}else if(command.type == "CONNECT_FROM"){
		state = state.set("connecting", Immutable.fromJS({id: command.id, nodeType: command.nodeType}));

	}else if(command.type == "CONNECT_TO"){
		var type = state.getIn(["connecting", "nodeType"]);
		var id = state.getIn(["connecting", "id"]);
		state = state.set("connecting", null);
		state = state.updateIn(["lists", type, "nodes", id, "connections"], connections => {
			var key = command.id + "." + command.param;
			if(!connections.get("data").has(key)){
				connections = connections.setIn(
					["data", key], 
					Immutable.fromJS({
						id: command.id,
						param: command.param
					})
				);
				connections = connections.update("order", list => list.push(key));
			}
			return connections;
		});

	}else if(command.type == "CONNECT_ABORT"){
		state = state.set("connecting", null);
	}else if(command.type == "CONNECTION_SELECT"){
		state = state.setIn(["lists", command.type, "nodes", command.id, "connections", "selected"], command.key);
	}else if(command.type == "EDIT"){
		state = state.set("edit", Immutable.fromJS({id: command.id, nodeType: command.nodeType}));
	}else if(command.type == "EDIT_END"){
		state = state.set("edit", null);
	}

	return state;
}