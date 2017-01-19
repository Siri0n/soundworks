var Redux = require("redux");
var Immutable = require("immutable");

const customNodeState = {
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
		delay: {
			collapsed: false,
			ids: [],
			nodes: {}
		},
		custom: {
			collapsed: true,
			ids: [],
			nodes: {}
		},
		input: {
			collapsed: false,
			ids: [],
			nodes: {}
		}
	},
	names: {"0": "out"},
	order: ["input", "custom", "periodicWave", "oscillator", "gain", "delay"],
	connecting: null,
	lastId: 0,
	view: {
		type: "custom",
		scope: null
	}
};

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
			collapsed: true,
			ids: [],
			nodes: {}
		},
		delay: {
			collapsed: false,
			ids: [],
			nodes: {}
		},
		custom: {
			collapsed: true,
			ids: [],
			nodes: {}
		}
	},
	names: {"0": "out"},
	order: ["custom", "instructions", "periodicWave", "oscillator", "gain", "delay"],
	edit: null,
	playing: false,
	connecting: null,
	lastId: 0,
	view: {
		type: "root",
		scope: null
	}
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
	}else if(nodeType == "delay"){
		result = {
			maxDelay: 1,
			delayTime: 1
		}
		name = uniqueName(names, "Delay");
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
/*	if(state.getIn(["view", "mode"]) != "root"){
		var path = state.getIn(["view", "path"]);
		return state.updateIn(path, nestedState => reducer(nestedState, command));
	}*/

	if(command.type == "SET_STATE"){
		state = Immutable.fromJS(JSON.parse(command.data));
	}else if(command.type == "TOGGLE_COLLAPSED"){
		state = state.updateIn(["lists", command.nodeType, "collapsed"], b => !b);
	}else if(command.type == "ADD"){
		var [node, name] = createNode(state.get("names"), command.nodeType);
		console.log(name);
		var id = state.get("lastId") + 1;
		state = state.set("lastId", id);
		id += "";
		state = state.setIn(["lists", command.nodeType, "nodes", id], node);
		state = state.updateIn(["lists", command.nodeType, "ids"], list => list.push(id));
		state = state.setIn(["names", id], name);

	}else if(command.type == "REMOVE"){
		state = state.deleteIn(["lists", command.nodeType, "nodes", command.id]);
		state = state.updateIn(["lists", command.nodeType, "ids"], list => list.filter(id => id != command.id));
		state = state.update("names", names => names.delete(command.id));
		if(command.nodeType != "periodicWave"){
			state.get("lists").forEach((list, type) => {
				list.get("nodes").forEach((node, id) => {
					state = state.updateIn(["lists", type, "nodes", id, "connections", "data"], 
						data => data.filter(elem => elem.get("id") != command.id));
					state = state.updateIn(["lists", type, "nodes", id, "connections", "order"], 
						order => order.filter(elem => elem.split(".")[0] != command.id));
					return true;
				});
				return true;
			});
		}else{
			state = state.updateIn(["lists", "oscillator", "nodes"], 
				nodes => nodes.map(
					node => node.update("type", type => type == command.id ? "sine" : type)
				)
			);
		}
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
			var key = command.id + (command.param ? "." + command.param : "");
			if(!connections.get("data").has(key)){
				connections = connections.setIn(
					["data", key], 
					Immutable.fromJS({
						id: command.id,
						param: command.param
					})
				);
				connections = connections.update("order", list => list.push(key));
				connections = connections.set("selected", key);
			}
			return connections;
		});

	}else if(command.type == "CONNECT_ABORT"){
		state = state.set("connecting", null);
	}else if(command.type == "CONNECT_REMOVE"){
		state = state.deleteIn(["lists", command.nodeType, "nodes", command.id, "connections", "data", command.key]);
		state = state.updateIn(["lists", command.nodeType, "nodes", command.id, "connections", "order"], 
			list => list.filter(key => key != command.key));
	}else if(command.type == "CONNECT_SELECT"){
		state = state.setIn(["lists", command.nodeType, "nodes", command.id, "connections", "selected"], command.key);
	}else if(command.type == "EDIT"){
		state = state.set("edit", Immutable.fromJS({id: command.id, nodeType: command.nodeType}));
	}else if(command.type == "EDIT_END"){
		state = state.set("edit", null);
	}

	return state;
}