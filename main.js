var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var UI = require("./ui/ui.jsx");
var store = window.store = require("./store/store");

var gist = window.location.search.match(/gist=([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/);
gist = gist && gist[1] + "/" + gist[2];
if(gist){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://gist.githubusercontent.com/" + gist + "/raw", true);
	xhr.onload = function(){
		store.dispatch({type: "SET_STATE", data: xhr.responseText});
	}
	xhr.send(null);
}
window.onload = () => 
ReactDOM.render(
	React.createElement(ReactRedux.Provider, {store}, React.createElement(UI)),
	document.getElementById("main")
);