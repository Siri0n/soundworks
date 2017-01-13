var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var UI = require("./ui/ui.jsx");
var store = window.store = require("./store/store");

window.init = function(data){
	store.dispatch({type: "SET_STATE", data});
}
var pastebinId = window.location.search.match(/pastebinId=([a-zA-Z0-9]+)/);
pastebinId = pastebinId && pastebinId[1];
if(pastebinId){
	var jsonp = document.createElement("script");
	jsonp.setAttribute("src", "http://pastebin.com/raw/" + pastebinId)
	document.head.appendChild(jsonp);
}
window.onload = () => 
ReactDOM.render(
	React.createElement(ReactRedux.Provider, {store}, React.createElement(UI)),
	document.getElementById("main")
);