var Redux = require("redux");
var Immutable = require("immutable");

const EXPORTS_ID = "-1";
const OUT_ID = "0"

const listTemplate = Immutable.fromJS({
	collapsed: false,
	nodes: []
});


const viewTemplate = Immutable.fromJS({
	nodes: {
		[OUT_ID]: {
			nodeType: "out",
			name: "out"
		}
	},
	connections: {},
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
		"code",
		"transformer",
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
		"transformer",
		"wave",
		"custom",
		"oscillator",
		"gain",
		"delay"
	]
).set("name", "Custom")
.setIn(["nodes", EXPORTS_ID], Immutable.fromJS({
	nodeType: "exports",
	name: "exports",
	selectedConnection: null
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
	code: {
		name: "Code",
		text: ""
	},
	transformer: {
		name: "Transformer",
		text: ""
	},
	custom: customViewTemplate
}).map(template => template.set("selectedConnection", null))
.map((template, type) => template.set("nodeType", type));



var store = module.exports = Redux.createStore(reducer, mainViewTemplate);

function uniqueName(names, prefix){
	var i = 0;
	while(names.includes(prefix + ++i));
	return prefix + i;
}

function newId(view){
	var id = view.get("lastId") + 1;
	return [view.set("lastId", id), id + ""];
}


function createNode(view, type, template){
	let id;
	[view, id] = newId(view);
	let node = template.update("name", 
		name => uniqueName(view.get("nodes").map(node => node.get("name")), name)
	);
	view = view.setIn(["nodes", id], node);
	view = view.updateIn(["lists", type, "nodes"], list => list.push(id));
	return view;
}

function deleteNode(state, view, path, nodeId){
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
		view.update("connections", 
			list => list.filter(c => c.getIn(["from", "id"]) != nodeId)
		);
		view.get("connections").forEach((c, cid) => {
			if(c.getIn(["to", "id"]) == nodeId){
				[state, view] = removeConnection(state, view, path, cid);
			}
			return true;
		})
	}
	return [state, view];
}

function removeConnection(state, view, path, connectionId){
	var connection = view.getIn(["connections", connectionId]);
	var fromId = connection.getIn(["from", "id"]);
	if(fromId == EXPORTS_ID){
		let parentPath = getParentPath(path);
		let viewId = path.last();
		let parentView = state.getIn(parentPath);
		parentView.get("connections").forEach((c, cid) => {
			if(c.getIn(["to", "id"]) == viewId && c.getIn(["to", "param"]) == connectionId){
				[state, parentView] = removeConnection(state, parentView, parentPath, cid);
			}
			return true;
		});
		state = setView(state, parentView, parentPath);
	}else{
		view = view.updateIn(["nodes", fromId, "selectedConnection"], 
			cid => cid == connectionId ? null : cid);
	}
	view = view.update("connections", connections => connections.filter((c, cid) => cid != connectionId));
	return [state, view];
}

function getView(state){
	var view = state;
	var viewPath = Immutable.List();
	while(view.get("scope")){
		viewPath = viewPath.concat(view.get("scope"));
		view = view.getIn(view.get("scope"));
	}
	return [view, viewPath];
}

function setView(state, view, viewPath){
	if(viewPath.size){
		state = state.setIn(viewPath, view);
	}else{
		state = view;
	}
	return state;
}

function getParentPath(path){
	return path.splice(-2);
}

function reducer(state, command){
	console.log(command);


	var [view, viewPath] = getView(state);

	if(command.type == "LOAD"){
/*		if(!parentView){
			throw new Error("dafuq?");
		}
		parentView = deleteNode(parentView, parentView.getIn(["scope", 1]));
		let template = Immutable.fromJS(JSON.parse(command.data));
		parentView = createNode(parentView, "custom", template);
		parentView = parentView.set(
			"scope", 
			Immutable.fromJS(["nodes", parentView.get("lastId") + ""])
		);*/

	}else if(command.type == "TOGGLE_COLLAPSED"){
		view = view.updateIn(["lists", command.list, "collapsed"], b => !b);

	}else if(command.type == "CREATE_NODE"){
		view = createNode(view, command.nodeType, nodeTemplates.get(command.nodeType));

	}else if(command.type == "DELETE_NODE"){
		[state, view] = deleteNode(state, view, viewPath, command.id);		

	}else if(command.type == "MODIFY"){
		let path = command.path || [command.key];
		view = view.setIn(["nodes", command.id, ...path], command.value);

	}else if(command.type == "MODIFY_CUSTOM"){
		let path = ["nodes", command.id];
		let param = command.connectionId;
		while(view.getIn(path).get("nodeType") == "custom"){
			let c = view.getIn([...path, "connections", param]).toJS();
			path = [...path, "nodes", c.to.id];
			param = c.to.param;
		}
		view = view.setIn([...path, param], command.value);

	}else if(command.type == "TOGGLE_PLAYING"){
		view = view.update("playing", b => !b);

	}else if(command.type == "CONNECT_FROM"){
		view = view.set("connecting", 
			Immutable.fromJS({
				id: command.id,
				type: view.getIn(["nodes", command.id, "nodeType"]),
				param: command.param
			})
		);

	}else if(command.type == "CONNECT_TO"){
		let {id, param} = view.get("connecting").toJS();
		let connectionId;
		[view, connectionId] = newId(view);
		let connection = Immutable.fromJS({
			from: {id, param},
			to: {id: command.id, param: command.param}
		});
		if(id == EXPORTS_ID){
			connection = connection.set(
				"name",
				uniqueName(
					view.get("connections")
					.filter(c => c.getIn(["from", "id"]) == EXPORTS_ID)
					.map(c => c.get("name")),
					"Export"
				)
			)
		}

		view = view.set("connecting", null);

		if(view.get("connections").some(val => 
			val.get("from").equals(connection.get("from")) && 
			val.get("to").equals(connection.get("to"))
		)){
			//do nothing
		}else{
			view = view.setIn(["connections", connectionId], connection);
			view = view.setIn(["nodes", id, "selectedConnection"], connectionId);
		}

	}else if(command.type == "CONNECT_ABORT"){
		view = view.set("connecting", null);

	}else if(command.type == "CONNECT_REMOVE"){
		[state, view] = removeConnection(state, view, viewPath, command.connectionId);

	}else if(command.type == "CONNECT_RENAME"){
		view = view.setIn(["connections", command.connectionId, "name"], command.name);

	}else if(command.type == "CONNECT_SELECT"){
		let id = view.getIn(["connections", command.connectionId, "from", "id"]);
		view = view.setIn(["nodes", id, "selectedConnection"], command.connectionId);

	}else if(command.type == "EDIT_TEXT"){
		view = view.set("edit", command.id);

	}else if(command.type == "EDIT_TEXT_END"){
		view = view.set("edit", null);

	}else if(command.type == "EDIT_CUSTOM"){
		view = view.set("scope", Immutable.fromJS(["nodes", command.id]));

	}else if(command.type == "EDIT_CUSTOM_END"){
		state = state.setIn(viewPath.splice(-2, 2, "scope"), null);
	}

	return setView(state, view, viewPath);
}