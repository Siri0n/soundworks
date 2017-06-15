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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VuZFxcY29tbXVuaWNhdG9yLmpzIiwid29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLFFBQVEsbUJBQWQ7O0FBRUEsU0FBUyxNQUFULEdBQWlCO0FBQ2hCLEtBQUksTUFBTSxFQUFWO0FBQ0EsTUFBSyxFQUFMLEdBQVUsVUFBUyxFQUFULEVBQVk7QUFDckIsTUFBSSxJQUFKLENBQVMsRUFBVDtBQUNBLEVBRkQ7QUFHQSxNQUFLLFFBQUwsR0FBZ0IsWUFBaUI7QUFBQSxvQ0FBTCxJQUFLO0FBQUwsT0FBSztBQUFBOztBQUNoQyxNQUFJLE9BQUosQ0FBWTtBQUFBLFVBQU0sb0JBQU0sSUFBTixDQUFOO0FBQUEsR0FBWjtBQUNBLEVBRkQ7QUFHQTs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBd0I7QUFDdkIsS0FBSSxLQUFLLElBQVQ7QUFDQSxLQUFJLElBQUksSUFBUjtBQUNBLEtBQUksV0FBVyxDQUFDLEtBQUssTUFBTixJQUFnQixhQUFhLE1BQTVDO0FBQ0EsS0FBSSxPQUFPLFdBQVc7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsQ0FBTDtBQUFBLEVBQVgsR0FBbUM7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsRUFBaUIsR0FBakIsQ0FBTDtBQUFBLEVBQTlDO0FBQ0EsS0FBSSxZQUFZLEVBQWhCO0FBQ0EsS0FBSSxTQUFTLENBQWI7QUFDQSxLQUFJLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBTSxRQUFOO0FBQUEsRUFBWjtBQUNBLEtBQUksWUFBWSxJQUFJLE1BQUosRUFBaEI7QUFDQSxLQUFJLE9BQUo7QUFDQSxLQUFJLG9CQUFvQixLQUF4Qjs7QUFFQSxNQUFLLEtBQUwsR0FBYSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWO0FBQUEsU0FBcUIsVUFBVSxPQUEvQjtBQUFBLEVBQVosQ0FB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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPM0IsT0FBRyxNQUFIO0FBQ0E7QUFDRCxHQW5CRDtBQXFCQSxFQWhDZ0I7QUFnQ1oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUkVBRFkgPSBcImltY29tcGxldGVseXJlYWR5XCI7XHJcblxyXG5mdW5jdGlvbiBTaWduYWwoKXtcclxuXHR2YXIgY2JzID0gW107XHJcblx0dGhpcy5vbiA9IGZ1bmN0aW9uKGNiKXtcclxuXHRcdGNicy5wdXNoKGNiKTtcclxuXHR9XHJcblx0dGhpcy5kaXNwYXRjaCA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xyXG5cdFx0Y2JzLmZvckVhY2goY2IgPT4gY2IoLi4uYXJncykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gQ29tbXVuaWNhdG9yKHcpe1xyXG5cdHcgPSB3IHx8IHNlbGY7XHJcblx0dmFyIGMgPSB0aGlzO1xyXG5cdHZhciBpc1dvcmtlciA9ICFzZWxmLldvcmtlciB8fCB3IGluc3RhbmNlb2YgV29ya2VyO1xyXG5cdHZhciBwb3N0ID0gaXNXb3JrZXIgPyBtID0+IHcucG9zdE1lc3NhZ2UobSkgOiBtID0+IHcucG9zdE1lc3NhZ2UobSwgXCIqXCIpO1xyXG5cdHZhciBjYWxsYmFja3MgPSB7fTtcclxuXHR2YXIgbGFzdElkID0gMTtcclxuXHR2YXIgbmV3SWQgPSAoKSA9PiBsYXN0SWQrKztcclxuXHR2YXIgb25NZXNzYWdlID0gbmV3IFNpZ25hbCgpO1xyXG5cdHZhciBpc1JlYWR5O1xyXG5cdHZhciByZWFkeVJlc3BvbnNlU2VudCA9IGZhbHNlO1xyXG5cclxuXHR0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gaXNSZWFkeSA9IHJlc29sdmUpO1xyXG5cclxuXHR2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCFpc1dvcmtlciAmJiBlLnNvdXJjZSAhPSB3KXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5kYXRhID09IFJFQURZKXtcclxuXHRcdFx0aXNSZWFkeSgpO1xyXG5cdFx0XHRpZighcmVhZHlSZXNwb25zZVNlbnQpe1xyXG5cdFx0XHRcdHBvc3QoUkVBRFkpO1xyXG5cdFx0XHRcdHJlYWR5UmVzcG9uc2VTZW50ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZihlLmRhdGEucmVzcG9uc2Upe1xyXG5cdFx0XHRjYWxsYmFja3NbZS5kYXRhLnJlc3BvbnNlXShlLmRhdGEubXNnKTtcclxuXHRcdFx0ZGVsZXRlIGNhbGxiYWNrc1tlLmRhdGEucmVzcG9uc2VdO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdG9uTWVzc2FnZS5kaXNwYXRjaChlLmRhdGEubXNnLCBtc2cgPT4gcG9zdCh7cmVzcG9uc2U6IGUuZGF0YS5pZCwgbXNnfSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYoaXNXb3JrZXIpe1xyXG5cdFx0dy5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcclxuXHR9ZWxzZXtcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XHJcblx0fVxyXG5cclxuXHRwb3N0KFJFQURZKTtcclxuXHR0aGlzLnBvc3RNZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHZhciBpZCA9IG5ld0lkKCk7XHJcblx0XHRcdGNhbGxiYWNrc1tpZF0gPSByZXNvbHZlO1xyXG5cdFx0XHRwb3N0KHtpZCwgbXNnfSk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0dGhpcy5vbk1lc3NhZ2UgPSBvbk1lc3NhZ2Uub247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tbXVuaWNhdG9yOyIsImlmKCFzZWxmLndpbmRvdyl7KGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciBDb21tdW5pY2F0b3IgPSByZXF1aXJlKFwiLi9zb3VuZC9jb21tdW5pY2F0b3IuanNcIik7XHJcblxyXG5cdHZhciBjID0gbmV3IENvbW11bmljYXRvcigpO1xyXG5cclxuXHRsZXQgaWQgPSAxO1xyXG5cdGxldCBuZXdJZCA9IGZ1bmN0aW9uKCl7cmV0dXJuIGlkKyt9O1xyXG5cdGxldCBzY3JpcHRzID0ge307XHJcblx0bGV0IHN0YXRlcyA9IHt9O1xyXG5cclxuXHRjLm9uTWVzc2FnZShmdW5jdGlvbihtc2csIGNiKXtcclxuXHRcdGlmKG1zZy50eXBlID09IFwidGVzdFwiKXtcclxuXHRcdFx0Y2IobXNnLm1zZyArIFwiIGxvbFwiKTtcclxuXHRcdH1lbHNlIGlmKG1zZy50eXBlID09IFwiY29tcGlsZVwiKXtcclxuXHRcdFx0bGV0IHNjcmlwdElkID0gbmV3SWQoKTtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJ3b3JrZXIgaXMgY29tcGlsaW5nXCIsIG1zZy5zY3JpcHQpO1xyXG5cdFx0XHRzY3JpcHRzW3NjcmlwdElkXSA9IGV2YWwobXNnLnNjcmlwdCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiY29tcGlsZWRcIiwgc2NyaXB0SWQsIHNjcmlwdHNbc2NyaXB0SWRdKTtcclxuXHRcdFx0c3RhdGVzW3NjcmlwdElkXSA9IHt9O1xyXG5cdFx0XHRjYihzY3JpcHRJZCk7XHJcblx0XHR9ZWxzZSBpZihtc2cudHlwZSA9PSBcImNhbGxcIil7XHJcblx0XHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHRcdFx0bGV0IHN0YXRlID0gc3RhdGVzW21zZy5zY3JpcHRJZF07XHJcblx0XHRcdGxldCBmID0gc2NyaXB0c1ttc2cuc2NyaXB0SWRdO1xyXG5cdFx0XHRmb3IobGV0IHN0cmluZyBvZiBtc2cuc3RyaW5ncyl7XHJcblx0XHRcdFx0cmVzdWx0ID0gWy4uLnJlc3VsdCwgLi4uZihzdHJpbmcsIHN0YXRlKV07XHJcblx0XHRcdH1cclxuXHRcdFx0Y2IocmVzdWx0KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0pKCl9XHJcbiJdfQ==
