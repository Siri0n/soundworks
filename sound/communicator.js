const READY = "imcompletelyready";

function Signal(){
	var cbs = [];
	this.on = function(cb){
		cbs.push(cb);
	}
	this.dispatch = function(...args){
		cbs.forEach(cb => cb(...args));
	}
}

function Communicator(w){
	w = w || self;
	var c = this;
	var isWorker = !self.Worker || w instanceof Worker;
	var post = isWorker ? m => w.postMessage(m) : m => w.postMessage(m, "*");
	var callbacks = {};
	var lastId = 1;
	var newId = () => lastId++;
	var onMessage = new Signal();
	var isReady;
	var readyResponseSent = false;

	this.ready = new Promise((resolve, reject) => isReady = resolve);

	var listener = function(e){
		if(!isWorker && e.source != w){
			return;
		}
		if(e.data == READY){
			isReady();
			if(!readyResponseSent){
				post(READY);
				readyResponseSent = true;
			}
			return;
		}
		if(e.data.response){
			callbacks[e.data.response](e.data.msg);
			delete callbacks[e.data.response];
		}else{
			onMessage.dispatch(e.data.msg, msg => post({response: e.data.id, msg}));
		}
	}

	if(isWorker){
		w.onmessage = listener;
	}else{
		window.addEventListener("message", listener);
	}

	post(READY);
	this.postMessage = function(msg){
		return new Promise((resolve, reject) => {
			var id = newId();
			callbacks[id] = resolve;
			post({id, msg});
		})
	}

	this.onMessage = onMessage.on;
}

module.exports = Communicator;