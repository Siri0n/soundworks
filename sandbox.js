var Communicator = require("./sound/communicator.js");


var c = new Communicator(window.parent);

var w = new Communicator(worker);

c.onMessage((msg, cb) => {
	console.log("sandbox got message", msg);
	w.postMessage(msg).then(cb);
});

Promise.all([c.ready, w.ready])
.then(() => {console.log("ready"); c.postMessage("connected")});

console.log("loool");