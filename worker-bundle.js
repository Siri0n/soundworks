(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (!self.window) {
	(function () {

		var Communicator = require("./sound/communicator.js");

		var c = new Communicator();

		var id = 1;
		var newId = function newId() {
			return id++;
		};
		var scripts = {};
		var states = {};

		c.onMessage(function (msg, cb) {
			if (msg.type == "test") {
				cb(msg.msg + " lol");
			} else if (msg.type == "compile") {
				var scriptId = newId();
				console.log("worker is compiling", msg.script);
				scripts[scriptId] = eval(msg.script);
				console.log("compiled", scriptId, scripts[scriptId]);
				states[scriptId] = {};
				cb(scriptId);
			} else if (msg.type == "call") {
				var result = [];
				var state = states[msg.scriptId];
				var f = scripts[msg.scriptId];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = msg.strings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var string = _step.value;

						result = [].concat(_toConsumableArray(result), _toConsumableArray(f(string, state)));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				cb(result);
			}
		});
	})();
}

},{"./sound/communicator.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VuZFxcY29tbXVuaWNhdG9yLmpzIiwid29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLFFBQVEsbUJBQWQ7O0FBRUEsU0FBUyxNQUFULEdBQWlCO0FBQ2hCLEtBQUksTUFBTSxFQUFWO0FBQ0EsTUFBSyxFQUFMLEdBQVUsVUFBUyxFQUFULEVBQVk7QUFDckIsTUFBSSxJQUFKLENBQVMsRUFBVDtBQUNBLEVBRkQ7QUFHQSxNQUFLLFFBQUwsR0FBZ0IsWUFBaUI7QUFBQSxvQ0FBTCxJQUFLO0FBQUwsT0FBSztBQUFBOztBQUNoQyxNQUFJLE9BQUosQ0FBWTtBQUFBLFVBQU0sb0JBQU0sSUFBTixDQUFOO0FBQUEsR0FBWjtBQUNBLEVBRkQ7QUFHQTs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBd0I7QUFDdkIsS0FBSSxLQUFLLElBQVQ7QUFDQSxLQUFJLElBQUksSUFBUjtBQUNBLEtBQUksV0FBVyxDQUFDLEtBQUssTUFBTixJQUFnQixhQUFhLE1BQTVDO0FBQ0EsS0FBSSxPQUFPLFdBQVc7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsQ0FBTDtBQUFBLEVBQVgsR0FBbUM7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsRUFBaUIsR0FBakIsQ0FBTDtBQUFBLEVBQTlDO0FBQ0EsS0FBSSxZQUFZLEVBQWhCO0FBQ0EsS0FBSSxTQUFTLENBQWI7QUFDQSxLQUFJLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBTSxRQUFOO0FBQUEsRUFBWjtBQUNBLEtBQUksWUFBWSxJQUFJLE1BQUosRUFBaEI7QUFDQSxLQUFJLE9BQUo7QUFDQSxLQUFJLG9CQUFvQixLQUF4Qjs7QUFFQSxNQUFLLEtBQUwsR0FBYSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWO0FBQUEsU0FBcUIsVUFBVSxPQUEvQjtBQUFBLEVBQVosQ0FB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VixDQUF4QjtBQUNBO0FBTjBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTzNCLE9BQUcsTUFBSDtBQUNBO0FBQ0QsR0FuQkQ7QUFxQkEsRUFoQ2dCO0FBZ0NaIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFJFQURZID0gXCJpbWNvbXBsZXRlbHlyZWFkeVwiO1xyXG5cclxuZnVuY3Rpb24gU2lnbmFsKCl7XHJcblx0dmFyIGNicyA9IFtdO1xyXG5cdHRoaXMub24gPSBmdW5jdGlvbihjYil7XHJcblx0XHRjYnMucHVzaChjYik7XHJcblx0fVxyXG5cdHRoaXMuZGlzcGF0Y2ggPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuXHRcdGNicy5mb3JFYWNoKGNiID0+IGNiKC4uLmFyZ3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbW11bmljYXRvcih3KXtcclxuXHR3ID0gdyB8fCBzZWxmO1xyXG5cdHZhciBjID0gdGhpcztcclxuXHR2YXIgaXNXb3JrZXIgPSAhc2VsZi5Xb3JrZXIgfHwgdyBpbnN0YW5jZW9mIFdvcmtlcjtcclxuXHR2YXIgcG9zdCA9IGlzV29ya2VyID8gbSA9PiB3LnBvc3RNZXNzYWdlKG0pIDogbSA9PiB3LnBvc3RNZXNzYWdlKG0sIFwiKlwiKTtcclxuXHR2YXIgY2FsbGJhY2tzID0ge307XHJcblx0dmFyIGxhc3RJZCA9IDE7XHJcblx0dmFyIG5ld0lkID0gKCkgPT4gbGFzdElkKys7XHJcblx0dmFyIG9uTWVzc2FnZSA9IG5ldyBTaWduYWwoKTtcclxuXHR2YXIgaXNSZWFkeTtcclxuXHR2YXIgcmVhZHlSZXNwb25zZVNlbnQgPSBmYWxzZTtcclxuXHJcblx0dGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGlzUmVhZHkgPSByZXNvbHZlKTtcclxuXHJcblx0dmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZSl7XHJcblx0XHRjb25zb2xlLmxvZyhcImNvbW11bmljYXRvciBnb3QgbWVzc2FnZVwiLCBlLmRhdGEpO1xyXG5cdFx0aWYoIWlzV29ya2VyICYmIGUuc291cmNlICE9IHcpe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZihlLmRhdGEgPT0gUkVBRFkpe1xyXG5cdFx0XHRpc1JlYWR5KCk7XHJcblx0XHRcdGlmKCFyZWFkeVJlc3BvbnNlU2VudCl7XHJcblx0XHRcdFx0cG9zdChSRUFEWSk7XHJcblx0XHRcdFx0cmVhZHlSZXNwb25zZVNlbnQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmKGUuZGF0YS5yZXNwb25zZSl7XHJcblx0XHRcdGNhbGxiYWNrc1tlLmRhdGEucmVzcG9uc2VdKGUuZGF0YS5tc2cpO1xyXG5cdFx0XHRkZWxldGUgY2FsbGJhY2tzW2UuZGF0YS5yZXNwb25zZV07XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0b25NZXNzYWdlLmRpc3BhdGNoKGUuZGF0YS5tc2csIG1zZyA9PiBwb3N0KHtyZXNwb25zZTogZS5kYXRhLmlkLCBtc2d9KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZihpc1dvcmtlcil7XHJcblx0XHR3Lm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xyXG5cdH1lbHNle1xyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGxpc3RlbmVyKTtcclxuXHR9XHJcblxyXG5cdHBvc3QoUkVBRFkpO1xyXG5cdHRoaXMucG9zdE1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0dmFyIGlkID0gbmV3SWQoKTtcclxuXHRcdFx0Y2FsbGJhY2tzW2lkXSA9IHJlc29sdmU7XHJcblx0XHRcdHBvc3Qoe2lkLCBtc2d9KTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHR0aGlzLm9uTWVzc2FnZSA9IG9uTWVzc2FnZS5vbjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb21tdW5pY2F0b3I7IiwiaWYoIXNlbGYud2luZG93KXsoZnVuY3Rpb24oKXtcclxuXHJcblx0dmFyIENvbW11bmljYXRvciA9IHJlcXVpcmUoXCIuL3NvdW5kL2NvbW11bmljYXRvci5qc1wiKTtcclxuXHJcblx0dmFyIGMgPSBuZXcgQ29tbXVuaWNhdG9yKCk7XHJcblxyXG5cdGxldCBpZCA9IDE7XHJcblx0bGV0IG5ld0lkID0gZnVuY3Rpb24oKXtyZXR1cm4gaWQrK307XHJcblx0bGV0IHNjcmlwdHMgPSB7fTtcclxuXHRsZXQgc3RhdGVzID0ge307XHJcblxyXG5cdGMub25NZXNzYWdlKGZ1bmN0aW9uKG1zZywgY2Ipe1xyXG5cdFx0aWYobXNnLnR5cGUgPT0gXCJ0ZXN0XCIpe1xyXG5cdFx0XHRjYihtc2cubXNnICsgXCIgbG9sXCIpO1xyXG5cdFx0fWVsc2UgaWYobXNnLnR5cGUgPT0gXCJjb21waWxlXCIpe1xyXG5cdFx0XHRsZXQgc2NyaXB0SWQgPSBuZXdJZCgpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIndvcmtlciBpcyBjb21waWxpbmdcIiwgbXNnLnNjcmlwdCk7XHJcblx0XHRcdHNjcmlwdHNbc2NyaXB0SWRdID0gZXZhbChtc2cuc2NyaXB0KTtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJjb21waWxlZFwiLCBzY3JpcHRJZCwgc2NyaXB0c1tzY3JpcHRJZF0pO1xyXG5cdFx0XHRzdGF0ZXNbc2NyaXB0SWRdID0ge307XHJcblx0XHRcdGNiKHNjcmlwdElkKTtcclxuXHRcdH1lbHNlIGlmKG1zZy50eXBlID09IFwiY2FsbFwiKXtcclxuXHRcdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRsZXQgc3RhdGUgPSBzdGF0ZXNbbXNnLnNjcmlwdElkXTtcclxuXHRcdFx0bGV0IGYgPSBzY3JpcHRzW21zZy5zY3JpcHRJZF07XHJcblx0XHRcdGZvcihsZXQgc3RyaW5nIG9mIG1zZy5zdHJpbmdzKXtcclxuXHRcdFx0XHRyZXN1bHQgPSBbLi4ucmVzdWx0LCAuLi5mKHN0cmluZywgc3RhdGUpXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYihyZXN1bHQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxufSkoKX1cclxuIl19
