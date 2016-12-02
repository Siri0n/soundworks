var React = require("react");
var connect = require("react-redux").connect;
var Oscillator = require("./oscillator.jsx");

module.exports = connect(
	function({oscillators}){
		return {oscillators};
	},
	function(dispatch){
		return {
			add(){
				dispatch({type: "ADD"});		
			},
			remove(name){
				dispatch({type: "REMOVE", name});
			},
			modify(name, key, value){
				console.log(name, key, value)
				dispatch({type: "MODIFY", name, key, value});
			}
		}
	}
)(
	function({oscillators, add, remove, modify}){
		return <div>
			{oscillators.map(o => 
				<Oscillator key={o.name} data={o} remove={remove.bind(null, o.name)} modify={modify.bind(null, o.name)}/>
			)}
			<button onClick={add}>add</button>
		</div>
	}
);