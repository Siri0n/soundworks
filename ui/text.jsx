var React = require("react");
var connect = require("react-redux").connect;

module.exports = connect(
	function(state){
		return {text: JSON.stringify(state.toJS())}
	},
	function(dispatch){
		return {
		}
	}
)(function({text}){
	return <div style={{color: "white"}}>
		{text}
	</div>
})