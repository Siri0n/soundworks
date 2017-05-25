var React = require("react");
var Header = require("./header.jsx");
var Immutable = require("immutable");

module.exports = function({id, type, data, 
	methods: {remove, rename, modify}
}){
	return <div className="audio-node">
		<Header name={data.get("name")}
			connectable={false}
			remove={remove.bind(null, id)}
			rename={rename.bind(null, id)}/> 
		<div className="coefs"><table><tbody>
			{data.get("coefs").map((pair, index) => {
				return <tr key={index}>
					<td>{index + 1}</td>
					<td>
						<input type="text" value={pair.get(0)} onChange={
							e => modify(id, "coefs", data.get("coefs").setIn([index, 0], e.target.value))
						}/>
					</td>
					<td>
						<input type="text" value={pair.get(1)} onChange={
							e => modify(id, "coefs", data.get("coefs").setIn([index, 1], e.target.value))
						}/>
					</td>
				</tr>
			})}
			<tr>
				<td></td>
				<td>
					<button onClick={
						() => modify(id, "coefs", data.get("coefs").push(Immutable.fromJS([0, 0])))
					}>
						Add row
					</button>
				</td>
				<td>
					{data.get("coefs").size > 1 &&
					<button onClick={() => modify(id, "coefs", data.get("coefs").pop())}>
						Remove
					</button>}
				</td>
			</tr>
		</tbody></table></div>
	</div>
}