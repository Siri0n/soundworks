var Redux = require("redux");
var Immutable = require("immutable");

const listTemplate = Immutable.fromJS({
	collapsed: false,
	nodes: []
});

const connectionsTemplate = Immutable.fromJS({
	data: {},
	order: [],
	selected: null,
	incoming: {}
});

const viewTemplate = Immutable.fromJS({
	nodes: {
		"0": {
			nodeType: "out",
			name: "out",
			connections: connectionsTemplate 
		}
	},
	connecting: null,
	lastId: 0,
	scope: null
});

function createLists(view, arr){
	view = view.set(
		"listOrder", 
		Immutable.fromJS(arr)
	);
	view = view.set("lists", Immutable.fromJS({}));
	view.get("listOrder").forEach(key => {
		view = view.setIn(["lists", key], listTemplate);
		return true;
	});
	return view;
}

const mainViewTemplate = createLists(
	viewTemplate, 
	[
		"instruction",
		"wave",
		"custom",
		"oscillator",
		"gain",
		"delay"
	]
).set("nodeType", "root");


const customViewTemplate = createLists(
	viewTemplate, 
	[
		"wave",
		"custom",
		"oscillator",
		"gain",
		"delay"
	]
).set("name", "Custom")
.setIn(["nodes", "-1"], Immutable.fromJS({
	nodeType: "exports",
	name: "exports",
	connections: connectionsTemplate
}));

const nodeTemplates = Immutable.fromJS({
	oscillator: {
		name: "Oscillator",
		frequency: 500,
		detune: 0,
		type: "sine"
	},
	gain: {
		name: "Gain",
		gain: 1
	},
	delay: {
		name: "Delay",
		delayTime: 1,
		maxDelay: 1
	},
	wave: {
		name: "Wave",
		coefs: [[1, 0]]
	},
	instruction: {
		name: "Instruction",
		bar: 1,
		text: ""
	},
	custom: customViewTemplate
}).map(template => template.set("connections", connectionsTemplate))
.map((template, type) => template.set("nodeType", type));



var store = module.exports = Redux.createStore(reducer, mainViewTemplate);

function uniqueName(names, prefix){
	var i = 0;
	while(names.includes(prefix + ++i));
	return prefix + i;
}

function join(arg1, arg2){
	return arg1 + (arg2 ? ("." + arg2) : "");
}



function reducer(state, command){
	console.log(command);

	if(command.type == "SET_STATE"){
		return Immutable.fromJS(JSON.parse(command.data));
	}

	var view = state;
	var viewPath = Immutable.List();
	var parentPath = null;

	while(view.get("scope")){
		parentPath = viewPath;
		viewPath = viewPath.concat(view.get("scope"));
		view = view.getIn(view.get("scope"));
	}

	if(command.type == "TOGGLE_COLLAPSED"){
		view = view.updateIn(["lists", command.list, "collapsed"], b => !b);

	}else if(command.type == "CREATE_NODE"){
		let id = view.get("lastId") + 1;
		view = view.set("lastId", id);
		id += "";
		let node = nodeTemplates.get(command.nodeType).update("name", 
			name => uniqueName(view.get("nodes").map(node => node.get("name")), name)
		);
		view = view.setIn(["nodes", id], node);
		view = view.updateIn(["lists", command.nodeType, "nodes"], list => list.push(id));

	}else if(command.type == "DELETE_NODE"){
		let incoming = view.getIn(["nodes", command.id, "connections", "incoming"]);
		let type = view.getIn(["nodes", command.id, "nodeType"]);
		view = view.deleteIn(["nodes", command.id]);
		view = view.updateIn(["lists", type, "nodes"], list => list.filter(id => id != command.id));
		if(type == "wave"){
			//some oscillator shit
		}else{
			incoming.forEach((key, inkey) => {
				let [id, param] = inkey.split(".");
				view = view.deleteIn(["nodes", id, "connections", "data", key]);
				view = view.updateIn(["nodes", id, "connections", "order"], 
					list => list.filter(item => item != key));
			});
		}

	}else if(command.type == "MODIFY"){
		let path = command.path || [command.key];
		view = view.setIn(["nodes", command.id, ...path], command.value);

	}else if(command.type == "TOGGLE_PLAYING"){
		view = view.update("playing", b => !b);

	}else if(command.type == "CONNECT_FROM"){
		view = view.set("connecting", 
			Immutable.fromJS({
				id: command.id, 
				type: view.getIn(["nodes", command.id, "type"])
			})
		);

	}else if(command.type == "CONNECT_TO"){
		let {id, type} = view.get("connecting").toJS();
		let key = join(command.id, command.param);
		let success = false;
		view = view.set("connecting", null);
		view = view.updateIn(["nodes", id, "connections"], connections => {
			if(!connections.get("data").has(key)){
				success = true;
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
		if(success){
			view = view.setIn(["nodes", command.id, "connections", "incoming", join(id, command.param)], key);
		}

	}else if(command.type == "CONNECT_ABORT"){
		view = view.set("connecting", null);

	}else if(command.type == "CONNECT_REMOVE"){
		view = view.deleteIn(["nodes", command.id, "connections", "data", command.key]);
		view = view.updateIn(["nodes", command.id, "connections", "order"], 
			list => list.filter(key => key != command.key));
		view = view.setIn(["nodes", command.id, "connections", "selected"],
			view.getIn(["nodes", command.id, "connections", "order", 0]));
		let [id, param] = command.key.split("");
		view = view.deleteIn(["nodes", id, "connections", "incoming", join(command.id, param)]);

	}else if(command.type == "CONNECTION_SELECT"){
		view = view.setIn(["nodes", command.id, "connections", "selected"], command.key);

	}else if(command.type == "EDIT_INSTRUCTIONS"){
		view = view.set("edit", command.id);

	}else if(command.type == "EDIT_INSTRUCTIONS_END"){
		view = view.set("edit", null);

	}else if(command.type == "EDIT_CUSTOM"){
		view = view.set("scope", ["nodes", command.id]);

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