var React = require("react");
var FileSaver = require("file-saver");

module.exports = React.createClass({
	render: function(){
		return <div className="saveload">
			<button onClick={() => save(this.props.state)}>Save</button>
			<button onClick={() => this.input.click()}>Load</button>
			<input ref={val => this.input = val} 
				onChange={e => load(e, this.props.load)} 
				type="file" style={{display: "none"}}/>
		</div>
	}
})

function save(state){
	var obj = state.toJS();
	obj.playing = false;
	var file = new File(
		[JSON.stringify(obj)],
		obj.name + ".test",
		{type: "text/plain;charset=utf-8"}
	)
	FileSaver.saveAs(file);
}

function load(e, cb){
	var file = e.target.files[0];
	var reader = new FileReader();
	reader.onload = function(le){
		cb(le.target.result);
	}
	reader.readAsText(file);
}