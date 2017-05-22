(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Communicator = require("./sound/communicator.js");

var c = new Communicator(window.parent);

var w = new Communicator(worker);

c.onMessage(function (msg, cb) {
	console.log("sandbox got message", msg);
	w.postMessage(msg).then(cb);
});

Promise.all([c.ready, w.ready]).then(function () {
	console.log("ready");c.postMessage("connected");
});

console.log("loool");

},{"./sound/communicator.js":2}],2:[function(require,module,exports){
"use strict";

var READY = "imcompletelyready";

function Signal() {
	var cbs = [];
	this.on = function (cb) {
		cbs.push(cb);
	};
	this.dispatch = function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		cbs.forEach(function (cb) {
			return cb.apply(undefined, args);
		});
	};
}

function Communicator(w) {
	w = w || self;
	var c = this;
	var isWorker = !self.Worker || w instanceof Worker;
	var post = isWorker ? function (m) {
		return w.postMessage(m);
	} : function (m) {
		return w.postMessage(m, "*");
	};
	var callbacks = {};
	var lastId = 1;
	var newId = function newId() {
		return lastId++;
	};
	var onMessage = new Signal();
	var isReady;
	var readyResponseSent = false;

	this.ready = new Promise(function (resolve, reject) {
		return isReady = resolve;
	});

	var listener = function listener(e) {
		console.log("communicator got message", e.data);
		if (!isWorker && e.source != w) {
			return;
		}
		if (e.data == READY) {
			isReady();
			if (!readyResponseSent) {
				post(READY);
				readyResponseSent = true;
			}
			return;
		}
		if (e.data.response) {
			callbacks[e.data.response](e.data.msg);
			delete callbacks[e.data.response];
		} else {
			onMessage.dispatch(e.data.msg, function (msg) {
				return post({ response: e.data.id, msg: msg });
			});
		}
	};

	if (isWorker) {
		w.onmessage = listener;
	} else {
		window.addEventListener("message", listener);
	}

	post(READY);
	this.postMessage = function (msg) {
		return new Promise(function (resolve, reject) {
			var id = newId();
			callbacks[id] = resolve;
			post({ id: id, msg: msg });
		});
	};

	this.onMessage = onMessage.on;
}

module.exports = Communicator;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzYW5kYm94LmpzIiwic291bmRcXGNvbW11bmljYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxlQUFlLFFBQVEseUJBQVIsQ0FBbkI7O0FBR0EsSUFBSSxJQUFJLElBQUksWUFBSixDQUFpQixPQUFPLE1BQXhCLENBQVI7O0FBRUEsSUFBSSxJQUFJLElBQUksWUFBSixDQUFpQixNQUFqQixDQUFSOztBQUVBLEVBQUUsU0FBRixDQUFZLFVBQUMsR0FBRCxFQUFNLEVBQU4sRUFBYTtBQUN4QixTQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxHQUFuQztBQUNBLEdBQUUsV0FBRixDQUFjLEdBQWQsRUFBbUIsSUFBbkIsQ0FBd0IsRUFBeEI7QUFDQSxDQUhEOztBQUtBLFFBQVEsR0FBUixDQUFZLENBQUMsRUFBRSxLQUFILEVBQVUsRUFBRSxLQUFaLENBQVosRUFDQyxJQURELENBQ00sWUFBTTtBQUFDLFNBQVEsR0FBUixDQUFZLE9BQVosRUFBc0IsRUFBRSxXQUFGLENBQWMsV0FBZDtBQUEyQixDQUQ5RDs7QUFHQSxRQUFRLEdBQVIsQ0FBWSxPQUFaOzs7OztBQ2ZBLElBQU0sUUFBUSxtQkFBZDs7QUFFQSxTQUFTLE1BQVQsR0FBaUI7QUFDaEIsS0FBSSxNQUFNLEVBQVY7QUFDQSxNQUFLLEVBQUwsR0FBVSxVQUFTLEVBQVQsRUFBWTtBQUNyQixNQUFJLElBQUosQ0FBUyxFQUFUO0FBQ0EsRUFGRDtBQUdBLE1BQUssUUFBTCxHQUFnQixZQUFpQjtBQUFBLG9DQUFMLElBQUs7QUFBTCxPQUFLO0FBQUE7O0FBQ2hDLE1BQUksT0FBSixDQUFZO0FBQUEsVUFBTSxvQkFBTSxJQUFOLENBQU47QUFBQSxHQUFaO0FBQ0EsRUFGRDtBQUdBOztBQUVELFNBQVMsWUFBVCxDQUFzQixDQUF0QixFQUF3QjtBQUN2QixLQUFJLEtBQUssSUFBVDtBQUNBLEtBQUksSUFBSSxJQUFSO0FBQ0EsS0FBSSxXQUFXLENBQUMsS0FBSyxNQUFOLElBQWdCLGFBQWEsTUFBNUM7QUFDQSxLQUFJLE9BQU8sV0FBVztBQUFBLFNBQUssRUFBRSxXQUFGLENBQWMsQ0FBZCxDQUFMO0FBQUEsRUFBWCxHQUFtQztBQUFBLFNBQUssRUFBRSxXQUFGLENBQWMsQ0FBZCxFQUFpQixHQUFqQixDQUFMO0FBQUEsRUFBOUM7QUFDQSxLQUFJLFlBQVksRUFBaEI7QUFDQSxLQUFJLFNBQVMsQ0FBYjtBQUNBLEtBQUksUUFBUSxTQUFSLEtBQVE7QUFBQSxTQUFNLFFBQU47QUFBQSxFQUFaO0FBQ0EsS0FBSSxZQUFZLElBQUksTUFBSixFQUFoQjtBQUNBLEtBQUksT0FBSjtBQUNBLEtBQUksb0JBQW9CLEtBQXhCOztBQUVBLE1BQUssS0FBTCxHQUFhLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVY7QUFBQSxTQUFxQixVQUFVLE9BQS9CO0FBQUEsRUFBWixDQUFiOztBQUVBLEtBQUksV0FBVyxTQUFYLFFBQVcsQ0FBUyxDQUFULEVBQVc7QUFDekIsVUFBUSxHQUFSLENBQVksMEJBQVosRUFBd0MsRUFBRSxJQUExQztBQUNBLE1BQUcsQ0FBQyxRQUFELElBQWEsRUFBRSxNQUFGLElBQVksQ0FBNUIsRUFBOEI7QUFDN0I7QUFDQTtBQUNELE1BQUcsRUFBRSxJQUFGLElBQVUsS0FBYixFQUFtQjtBQUNsQjtBQUNBLE9BQUcsQ0FBQyxpQkFBSixFQUFzQjtBQUNyQixTQUFLLEtBQUw7QUFDQSx3QkFBb0IsSUFBcEI7QUFDQTtBQUNEO0FBQ0E7QUFDRCxNQUFHLEVBQUUsSUFBRixDQUFPLFFBQVYsRUFBbUI7QUFDbEIsYUFBVSxFQUFFLElBQUYsQ0FBTyxRQUFqQixFQUEyQixFQUFFLElBQUYsQ0FBTyxHQUFsQztBQUNBLFVBQU8sVUFBVSxFQUFFLElBQUYsQ0FBTyxRQUFqQixDQUFQO0FBQ0EsR0FIRCxNQUdLO0FBQ0osYUFBVSxRQUFWLENBQW1CLEVBQUUsSUFBRixDQUFPLEdBQTFCLEVBQStCO0FBQUEsV0FBTyxLQUFLLEVBQUMsVUFBVSxFQUFFLElBQUYsQ0FBTyxFQUFsQixFQUFzQixRQUF0QixFQUFMLENBQVA7QUFBQSxJQUEvQjtBQUNBO0FBQ0QsRUFuQkQ7O0FBcUJBLEtBQUcsUUFBSCxFQUFZO0FBQ1gsSUFBRSxTQUFGLEdBQWMsUUFBZDtBQUNBLEVBRkQsTUFFSztBQUNKLFNBQU8sZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsUUFBbkM7QUFDQTs7QUFFRCxNQUFLLEtBQUw7QUFDQSxNQUFLLFdBQUwsR0FBbUIsVUFBUyxHQUFULEVBQWE7QUFDL0IsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3ZDLE9BQUksS0FBSyxPQUFUO0FBQ0EsYUFBVSxFQUFWLElBQWdCLE9BQWhCO0FBQ0EsUUFBSyxFQUFDLE1BQUQsRUFBSyxRQUFMLEVBQUw7QUFDQSxHQUpNLENBQVA7QUFLQSxFQU5EOztBQVFBLE1BQUssU0FBTCxHQUFpQixVQUFVLEVBQTNCO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDb21tdW5pY2F0b3IgPSByZXF1aXJlKFwiLi9zb3VuZC9jb21tdW5pY2F0b3IuanNcIik7XHJcblxyXG5cclxudmFyIGMgPSBuZXcgQ29tbXVuaWNhdG9yKHdpbmRvdy5wYXJlbnQpO1xyXG5cclxudmFyIHcgPSBuZXcgQ29tbXVuaWNhdG9yKHdvcmtlcik7XHJcblxyXG5jLm9uTWVzc2FnZSgobXNnLCBjYikgPT4ge1xyXG5cdGNvbnNvbGUubG9nKFwic2FuZGJveCBnb3QgbWVzc2FnZVwiLCBtc2cpO1xyXG5cdHcucG9zdE1lc3NhZ2UobXNnKS50aGVuKGNiKTtcclxufSk7XHJcblxyXG5Qcm9taXNlLmFsbChbYy5yZWFkeSwgdy5yZWFkeV0pXHJcbi50aGVuKCgpID0+IHtjb25zb2xlLmxvZyhcInJlYWR5XCIpOyBjLnBvc3RNZXNzYWdlKFwiY29ubmVjdGVkXCIpfSk7XHJcblxyXG5jb25zb2xlLmxvZyhcImxvb29sXCIpOyIsImNvbnN0IFJFQURZID0gXCJpbWNvbXBsZXRlbHlyZWFkeVwiO1xyXG5cclxuZnVuY3Rpb24gU2lnbmFsKCl7XHJcblx0dmFyIGNicyA9IFtdO1xyXG5cdHRoaXMub24gPSBmdW5jdGlvbihjYil7XHJcblx0XHRjYnMucHVzaChjYik7XHJcblx0fVxyXG5cdHRoaXMuZGlzcGF0Y2ggPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuXHRcdGNicy5mb3JFYWNoKGNiID0+IGNiKC4uLmFyZ3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbW11bmljYXRvcih3KXtcclxuXHR3ID0gdyB8fCBzZWxmO1xyXG5cdHZhciBjID0gdGhpcztcclxuXHR2YXIgaXNXb3JrZXIgPSAhc2VsZi5Xb3JrZXIgfHwgdyBpbnN0YW5jZW9mIFdvcmtlcjtcclxuXHR2YXIgcG9zdCA9IGlzV29ya2VyID8gbSA9PiB3LnBvc3RNZXNzYWdlKG0pIDogbSA9PiB3LnBvc3RNZXNzYWdlKG0sIFwiKlwiKTtcclxuXHR2YXIgY2FsbGJhY2tzID0ge307XHJcblx0dmFyIGxhc3RJZCA9IDE7XHJcblx0dmFyIG5ld0lkID0gKCkgPT4gbGFzdElkKys7XHJcblx0dmFyIG9uTWVzc2FnZSA9IG5ldyBTaWduYWwoKTtcclxuXHR2YXIgaXNSZWFkeTtcclxuXHR2YXIgcmVhZHlSZXNwb25zZVNlbnQgPSBmYWxzZTtcclxuXHJcblx0dGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGlzUmVhZHkgPSByZXNvbHZlKTtcclxuXHJcblx0dmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcImNvbW11bmljYXRvciBnb3QgbWVzc2FnZVwiLCBlLmRhdGEpO1xyXG5cdFx0aWYoIWlzV29ya2VyICYmIGUuc291cmNlICE9IHcpe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZihlLmRhdGEgPT0gUkVBRFkpe1xyXG5cdFx0XHRpc1JlYWR5KCk7XHJcblx0XHRcdGlmKCFyZWFkeVJlc3BvbnNlU2VudCl7XHJcblx0XHRcdFx0cG9zdChSRUFEWSk7XHJcblx0XHRcdFx0cmVhZHlSZXNwb25zZVNlbnQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmKGUuZGF0YS5yZXNwb25zZSl7XHJcblx0XHRcdGNhbGxiYWNrc1tlLmRhdGEucmVzcG9uc2VdKGUuZGF0YS5tc2cpO1xyXG5cdFx0XHRkZWxldGUgY2FsbGJhY2tzW2UuZGF0YS5yZXNwb25zZV07XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0b25NZXNzYWdlLmRpc3BhdGNoKGUuZGF0YS5tc2csIG1zZyA9PiBwb3N0KHtyZXNwb25zZTogZS5kYXRhLmlkLCBtc2d9KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZihpc1dvcmtlcil7XHJcblx0XHR3Lm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xyXG5cdH1lbHNle1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcclxuXHR9XHJcblxyXG5cdHBvc3QoUkVBRFkpO1xyXG5cdHRoaXMucG9zdE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0dmFyIGlkID0gbmV3SWQoKTtcclxuXHRcdFx0Y2FsbGJhY2tzW2lkXSA9IHJlc29sdmU7XHJcblx0XHRcdHBvc3Qoe2lkLCBtc2d9KTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHR0aGlzLm9uTWVzc2FnZSA9IG9uTWVzc2FnZS5vbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tdW5pY2F0b3I7Il19
