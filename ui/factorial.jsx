var React = require("react");

function Factorial({n, result}){
	result = result || 1;
	if(!n){
		return <span>{result}</span>
	}else{
		return <Factorial n={n - 1} result={result*n}/>
	}
}

module.exports = Factorial;