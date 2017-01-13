var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var UI = require("./ui/ui.jsx");
var store = window.store = require("./store/store");

var pastebinId = window.location.search.match(/pastebinId=([a-zA-Z0-9]+)/);
pastebinId = pastebinId && pastebinId[1];
if(pastebinId){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://pastebin.com/raw/" + pastebinId, true);
	xhr.onreadystatechange = function(){
		console.log("xhr", xhr);
	}
	xhr.onload = function(response){
		store.dispatch({type: "SET_STATE", data: xhr.responseText});
	}
	xhr.send(null);
}
window.onload = () => 
ReactDOM.render(
	React.createElement(ReactRedux.Provider, {store}, React.createElement(UI)),
	document.getElementById("main")
);