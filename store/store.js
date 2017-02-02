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

function join_(arg1, arg2){
	return arg1 + (arg2 ? ("_" + arg2) : "");
}


function createNode(view, type, template){
	let id = view.get("lastId") + 1;
	view = view.set("lastId", id);
	id += "";
	let node = template.update("name", 
		name => uniqueName(view.get("nodes").map(node => node.get("name")), name)
	);
	view = view.setIn(["nodes", id], node);
	view = view.updateIn(["lists", type, "nodes"], list => list.push(id));
	return view;
}

function deleteNode(view, nodeId){
	let incoming = view.getIn(["nodes", nodeId, "connections", "incoming"]);
	let type = view.getIn(["nodes", nodeId, "nodeType"]);
	view = view.deleteIn(["nodes", nodeId]);
	view = view.updateIn(["lists", type, "nodes"], list => list.filter(id => id != nodeId));
	if(type == "wave"){
		view.update("nodes", 
			nodes => nodes.map(node => {
				if(node.get("type") == nodeId){
					node.set("type", "sine");
				}
				return node;
			})
		)
	}else{
		incoming.forEach((key, inkey) => {
			let [id, param] = inkey.split(".");
			if(id == "-1"){
				view.getIn(["connections", "incoming"]).forEach((key1, inkey1) => {
					console.log(key1, inkey1, key, inkey);
					let [id1, param1] = inkey1.split(".");
					if(param1 == key.replace(".", "_")){
						parentView = removeConnection(parentView, id1, key1);
					}
				})
			}
			view = view.deleteIn(["nodes", id, "connections", "data", key]);
			view = view.updateIn(["nodes", id, "connections", "order"], 
				list => list.filter(item => item != key));
		});
	}
	return view;
}

function removeConnection(view, nodeId, key){
	console.log("remove", view.toJS(), nodeId, key);
	view = view.deleteIn(["nodes", nodeId, "connections", "data", key]);
	view = view.updateIn(["nodes", nodeId, "connections", "order"], 
		list => list.filter(key => key != key));
	view = view.setIn(["nodes", nodeId, "connections", "selected"],
		view.getIn(["nodes", nodeId, "connections", "order", 0]));
	let [id, param] = key.split("");
	view = view.deleteIn(["nodes", id, "connections", "incoming", join(nodeId, param)]);
	return view;
}

function reducer(state, command){
	console.log(command);


	var view = state;
	var viewPath = Immutable.List();
	var parentPath = null;
	var parentView = null;
	while(view.get("scope")){
		parentPath = viewPath;
		viewPath = viewPath.concat(view.get("scope"));
		view = view.getIn(view.get("scope"));
	}

	if(parentPath){
		if(parentPath.size){
			parentView = state.getIn(parentPath);
		}else{
			parentView = state;
		}
	}
	if(command.type == "LOAD"){
		if(!parentView){
			throw new Error("dafuq?");
		}
		parentView = deleteNode(parentView, parentView.getIn(["scope", 1]));
		let template = Immutable.fromJS(JSON.parse(command.data));
		parentView = createNode(parentView, "custom", template);
		parentView = parentView.set(
			"scope", 
			Immutable.fromJS(["nodes", parentView.get("lastId") + ""])
		);

	}else if(command.type == "TOGGLE_COLLAPSED"){
		view = view.updateIn(["lists", command.list, "collapsed"], b => !b);

	}else if(command.type == "CREATE_NODE"){
		view = createNode(view, command.nodeType, nodeTemplates.get(command.nodeType));

	}else if(command.type == "DELETE_NODE"){
		view = deleteNode(view, command.id);		

	}else if(command.type == "MODIFY"){
		let path = command.path || [command.key];
		view = view.setIn(["nodes", command.id, ...path], command.value);

	}else if(command.type == "TOGGLE_PLAYING"){
		view = view.update("playing", b => !b);

	}else if(command.type == "CONNECT_FROM"){
		view = view.set("connecting", 
			Immutable.fromJS({
				id: command.id, 
				type: view.getIn(["nodes", command.id, "nodeType"])
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
			console.log(type);
			view = view.setIn(["nodes", command.id, "connections", "incoming", join(id, command.param)], key);
			if(type =="exports"){
				view = view.setIn(["nodes", id, "connections", "data", key, "name"],
					uniqueName(
						view.getIn(["nodes", id, "connections", "data"]).map(elem => elem.get("name")),
						"Export"
					)
				);
			}
		}

	}else if(command.type == "CONNECT_ABORT"){
		view = view.set("connecting", null);

	}else if(command.type == "CONNECT_REMOVE"){
		view = removeConnection(view, command.id, command.key);

	}else if(command.type == "CONNECTION_SELECT"){
		view = view.setIn(["nodes", command.id, "connections", "selected"], command.key);

	}else if(command.type == "EDIT_INSTRUCTIONS"){
		view = view.set("edit", command.id);

	}else if(command.type == "EDIT_INSTRUCTIONS_END"){
		view = view.set("edit", null);

	}else if(command.type == "EDIT_CUSTOM"){
		view = view.set("scope", Immutable.fromJS(["nodes", command.id]));

	}else if(command.type == "EDIT_CUSTOM_END"){
		parentView = parentView.set("scope", null);

	}

	if(parentView){
		if(parentPath.size){
			state = state.setIn(parentPath, parentView)
		}else{
			state = parentView;
		}
	}

	if(viewPath.size){
		state = state.setIn(viewPath, view);
	}else{
		state = view;
	}

	return state;
}