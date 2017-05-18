var connectable = {
	audioNode(id, connecting){
		return connecting && connecting.get("id") != id && connecting.get("type") != "code" 
			&& connecting.get("type") != "transformer";
	},
	audioParam(id, connecting){
		return connecting && connecting.get("id") != id && connecting.get("type") != "code";
	}
}

module.exports = {connectable}