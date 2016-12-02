var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var UI = require("./ui/ui.jsx");
var store = window.store = require("./store/store");

window.onload = () => 
ReactDOM.render(
	React.createElement(ReactRedux.Provider, {store}, React.createElement(UI)),
	document.getElementById("main")
);