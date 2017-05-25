var React = require("react");
var Header = React.createClass({
	componentWillMount() {
		this.setState({editing: false});
 	},
	render: function(){
		var editing = this.state.editing;
		var {connectable, connectTo, name, remove, rename} = this.props;
		if(editing){
			return <div>
				<input className="header" type="text" defaultValue={name} 
					onChange={e => this.setState({name: e.target.value})}/>
				<span className="close" onClick={() => {rename(this.state.name); this.setState({editing: false})}}>
					v
				</span>
			</div>
		}else{
			return <div>
				<span className={connectable ? "highlighted" : ""} 
					onClick={connectable ? connectTo : () => this.setState({editing: true})}>
					{name}
				</span>
				<span className="close" onClick={remove}>
					x
				</span>
			</div>
		}
	}
});

module.exports = Header;