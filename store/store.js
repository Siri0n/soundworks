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
	}else if(nodeType == "custom"){
		result = customNodeState;
		name = uniqueName(names, "Custom");
	}else if(nodeType == "input"){
		result = {
			offset: 1
		}
		name = uniqueName(names, "Input");
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

	var view = state;
	var viewPath = Immutable.List();
	var parentPath = null;

	while(view.getIn(["view", "scope"])){
		parentPath = viewPath;
		viewPath = viewPath.concat(view.getIn(["view", "scope"]));
		view = view.getIn(view.getIn(["view", "scope"]));
	}

	if(command.type == "SET_STATE"){
		view = Immutable.fromJS(JSON.parse(command.data));
	}else if(command.type == "TOGGLE_COLLAPSED"){
		view = view.updateIn(["lists", command.nodeType, "collapsed"], b => !b);
	}else if(command.type == "ADD"){
		var [node, name] = createNode(view.get("names"), command.nodeType);
		var id = view.get("lastId") + 1;
		view = view.set("lastId", id);
		id += "";
		view = view.setIn(["lists", command.nodeType, "nodes", id], node);
		view = view.updateIn(["lists", command.nodeType, "ids"], list => list.push(id));
		view = view.setIn(["names", id], name);

	}else if(command.type == "REMOVE"){
		view = view.deleteIn(["lists", command.nodeType, "nodes", command.id]);
		view = view.updateIn(["lists", command.nodeType, "ids"], list => list.filter(id => id != command.id));
		view = view.update("names", names => names.delete(command.id));
		if(command.nodeType == "periodicWave"){
			view = view.updateIn(["lists", "oscillator", "nodes"], 
				nodes => nodes.map(
					node => node.update("type", type => type == command.id ? "sine" : type)
				)
			);
		}else if(command.nodeType == "input"){
			//здесь должно быть сложное дерьмо, удаляющее коннекты к этому инпуту во вьюхе уровнем выше
			alert("Дверь запили!");
		}else{
			view.get("lists").forEach((list, type) => {
				list.get("nodes").forEach((node, id) => {
					view = view.updateIn(["lists", type, "nodes", id, "connections", "data"], 
						data => data.filter(elem => elem.get("id") != command.id));
					view = view.updateIn(["lists", type, "nodes", id, "connections", "order"], 
						order => order.filter(elem => elem.split(".")[0] != command.id));
					return true;
				});
				return true;
			});
		}
	}else if(command.type == "MODIFY"){
		if(command.nodeType != "custom"){
			view = view.setIn(["lists", command.nodeType, "nodes", command.id, command.key], command.value);
		}else{
			view = view.setIn(["lists", command.nodeType, "nodes", command.id, 
				"lists", "input", command.key, "offset"], command.value);
		}

	}else if(command.type == "TOGGLE_PLAYING"){
		view = view.update("playing", b => !b);

	}else if(command.type == "CONNECT_FROM"){
		view = view.set("connecting", Immutable.fromJS({id: command.id, nodeType: command.nodeType}));

	}else if(command.type == "CONNECT_TO"){
		var type = view.getIn(["connecting", "nodeType"]);
		var id = view.getIn(["connecting", "id"]);
		view = view.set("connecting", null);
		view = view.updateIn(["lists", type, "nodes", id, "connections"], connections => {
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
		view = view.set("connecting", null);

	}else if(command.type == "CONNECT_REMOVE"){
		view = view.deleteIn(["lists", command.nodeType, "nodes", command.id, "connections", "data", command.key]);
		view = view.updateIn(["lists", command.nodeType, "nodes", command.id, "connections", "order"], 
			list => list.filter(key => key != command.key));

	}else if(command.type == "CONNECT_SELECT"){
		view = view.setIn(["lists", command.nodeType, "nodes", command.id, "connections", "selected"], command.key);

	}else if(command.type == "EDIT_INSTRUCTIONS"){
		view = view.set("edit", Immutable.fromJS({id: command.id, nodeType: command.nodeType}));

	}else if(command.type == "EDIT_INSTRUCTIONS_END"){
		view = view.set("edit", null);
	}else if(command.type == "EDIT_CUSTOM"){
		view = view.setIn(["view", "scope"], ["lists", command.nodeType, "nodes", command.id]);
	}else if(command.type == "EDIT_CUSTOM_END"){
		state = state.setIn([...parentPath, "view", "scope"], null);
	}

	if(viewPath.size){
		state = state.setIn(viewPath, view);
	}else{
		state = view;
	}

	return state;
}