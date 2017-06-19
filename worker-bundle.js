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

		c.onMessage(function (msg, cb) {
			if (msg.type == "test") {
				cb(msg.msg + " lol");
			} else if (msg.type == "compile") {
				var scriptId = newId();
				scripts[scriptId] = eval(msg.script);
				cb(scriptId);
			} else if (msg.type == "call") {
				var result = [];
				var script = scripts[msg.scriptId];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = msg.strings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var string = _step.value;

						result = [].concat(_toConsumableArray(result), _toConsumableArray(script.main(string)));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VuZFxcY29tbXVuaWNhdG9yLmpzIiwid29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLFFBQVEsbUJBQWQ7O0FBRUEsU0FBUyxNQUFULEdBQWlCO0FBQ2hCLEtBQUksTUFBTSxFQUFWO0FBQ0EsTUFBSyxFQUFMLEdBQVUsVUFBUyxFQUFULEVBQVk7QUFDckIsTUFBSSxJQUFKLENBQVMsRUFBVDtBQUNBLEVBRkQ7QUFHQSxNQUFLLFFBQUwsR0FBZ0IsWUFBaUI7QUFBQSxvQ0FBTCxJQUFLO0FBQUwsT0FBSztBQUFBOztBQUNoQyxNQUFJLE9BQUosQ0FBWTtBQUFBLFVBQU0sb0JBQU0sSUFBTixDQUFOO0FBQUEsR0FBWjtBQUNBLEVBRkQ7QUFHQTs7QUFFRCxTQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBd0I7QUFDdkIsS0FBSSxLQUFLLElBQVQ7QUFDQSxLQUFJLElBQUksSUFBUjtBQUNBLEtBQUksV0FBVyxDQUFDLEtBQUssTUFBTixJQUFnQixhQUFhLE1BQTVDO0FBQ0EsS0FBSSxPQUFPLFdBQVc7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsQ0FBTDtBQUFBLEVBQVgsR0FBbUM7QUFBQSxTQUFLLEVBQUUsV0FBRixDQUFjLENBQWQsRUFBaUIsR0FBakIsQ0FBTDtBQUFBLEVBQTlDO0FBQ0EsS0FBSSxZQUFZLEVBQWhCO0FBQ0EsS0FBSSxTQUFTLENBQWI7QUFDQSxLQUFJLFFBQVEsU0FBUixLQUFRO0FBQUEsU0FBTSxRQUFOO0FBQUEsRUFBWjtBQUNBLEtBQUksWUFBWSxJQUFJLE1BQUosRUFBaEI7QUFDQSxLQUFJLE9BQUo7QUFDQSxLQUFJLG9CQUFvQixLQUF4Qjs7QUFFQSxNQUFLLEtBQUwsR0FBYSxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWO0FBQUEsU0FBcUIsVUFBVSxPQUEvQjtBQUFBLEVBQVosQ0FBYjs7QUFFQSxLQUFJLFdBQVcsU0FBWCxRQUFXLENBQVMsQ0FBVCxFQUFXO0FBQ3pCLE1BQUcsQ0FBQyxRQUFELElBQWEsRUFBRSxNQUFGLElBQVksQ0FBNUIsRUFBOEI7QUFDN0I7QUFDQTtBQUNELE1BQUcsRUFBRSxJQUFGLElBQVUsS0FBYixFQUFtQjtBQUNsQjtBQUNBLE9BQUcsQ0FBQyxpQkFBSixFQUFzQjtBQUNyQixTQUFLLEtBQUw7QUFDQSx3QkFBb0IsSUFBcEI7QUFDQTtBQUNEO0FBQ0E7QUFDRCxNQUFHLEVBQUUsSUFBRixDQUFPLFFBQVYsRUFBbUI7QUFDbEIsYUFBVSxFQUFFLElBQUYsQ0FBTyxRQUFqQixFQUEyQixFQUFFLElBQUYsQ0FBTyxHQUFsQztBQUNBLFVBQU8sVUFBVSxFQUFFLElBQUYsQ0FBTyxRQUFqQixDQUFQO0FBQ0EsR0FIRCxNQUdLO0FBQ0osYUFBVSxRQUFWLENBQW1CLEVBQUUsSUFBRixDQUFPLEdBQTFCLEVBQStCO0FBQUEsV0FBTyxLQUFLLEVBQUMsVUFBVSxFQUFFLElBQUYsQ0FBTyxFQUFsQixFQUFzQixRQUF0QixFQUFMLENBQVA7QUFBQSxJQUEvQjtBQUNBO0FBQ0QsRUFsQkQ7O0FBb0JBLEtBQUcsUUFBSCxFQUFZO0FBQ1gsSUFBRSxTQUFGLEdBQWMsUUFBZDtBQUNBLEVBRkQsTUFFSztBQUNKLFNBQU8sZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsUUFBbkM7QUFDQTs7QUFFRCxNQUFLLEtBQUw7QUFDQSxNQUFLLFdBQUwsR0FBbUIsVUFBUyxHQUFULEVBQWE7QUFDL0IsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3ZDLE9BQUksS0FBSyxPQUFUO0FBQ0EsYUFBVSxFQUFWLElBQWdCLE9BQWhCO0FBQ0EsUUFBSyxFQUFDLE1BQUQsRUFBSyxRQUFMLEVBQUw7QUFDQSxHQUpNLENBQVA7QUFLQSxFQU5EOztBQVFBLE1BQUssU0FBTCxHQUFpQixVQUFVLEVBQTNCO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCOzs7Ozs7O0FDaEVBLElBQUcsQ0FBQyxLQUFLLE1BQVQsRUFBZ0I7QUFBQyxFQUFDLFlBQVU7O0FBRTNCLE1BQUksZUFBZSxRQUFRLHlCQUFSLENBQW5COztBQUVBLE1BQUksSUFBSSxJQUFJLFlBQUosRUFBUjs7QUFFQSxNQUFJLEtBQUssQ0FBVDtBQUNBLE1BQUksUUFBUSxTQUFSLEtBQVEsR0FBVTtBQUFDLFVBQU8sSUFBUDtBQUFZLEdBQW5DO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsSUFBRSxTQUFGLENBQVksVUFBUyxHQUFULEVBQWMsRUFBZCxFQUFpQjtBQUM1QixPQUFHLElBQUksSUFBSixJQUFZLE1BQWYsRUFBc0I7QUFDckIsT0FBRyxJQUFJLEdBQUosR0FBVSxNQUFiO0FBQ0EsSUFGRCxNQUVNLElBQUcsSUFBSSxJQUFKLElBQVksU0FBZixFQUF5QjtBQUM5QixRQUFJLFdBQVcsT0FBZjtBQUNBLFlBQVEsUUFBUixJQUFvQixLQUFLLElBQUksTUFBVCxDQUFwQjtBQUNBLE9BQUcsUUFBSDtBQUNBLElBSkssTUFJQSxJQUFHLElBQUksSUFBSixJQUFZLE1BQWYsRUFBc0I7QUFDM0IsUUFBSSxTQUFTLEVBQWI7QUFDQSxRQUFJLFNBQVMsUUFBUSxJQUFJLFFBQVosQ0FBYjtBQUYyQjtBQUFBO0FBQUE7O0FBQUE7QUFHM0IsMEJBQWtCLElBQUksT0FBdEIsOEhBQThCO0FBQUEsVUFBdEIsTUFBc0I7O0FBQzdCLDRDQUFhLE1BQWIsc0JBQXdCLE9BQU8sSUFBUCxDQUFZLE1BQVosQ0FBeEI7QUFDQTtBQUwwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU0zQixPQUFHLE1BQUg7QUFDQTtBQUNELEdBZkQ7QUFpQkEsRUEzQmdCO0FBMkJaIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFJFQURZID0gXCJpbWNvbXBsZXRlbHlyZWFkeVwiO1xyXG5cclxuZnVuY3Rpb24gU2lnbmFsKCl7XHJcblx0dmFyIGNicyA9IFtdO1xyXG5cdHRoaXMub24gPSBmdW5jdGlvbihjYil7XHJcblx0XHRjYnMucHVzaChjYik7XHJcblx0fVxyXG5cdHRoaXMuZGlzcGF0Y2ggPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuXHRcdGNicy5mb3JFYWNoKGNiID0+IGNiKC4uLmFyZ3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbW11bmljYXRvcih3KXtcclxuXHR3ID0gdyB8fCBzZWxmO1xyXG5cdHZhciBjID0gdGhpcztcclxuXHR2YXIgaXNXb3JrZXIgPSAhc2VsZi5Xb3JrZXIgfHwgdyBpbnN0YW5jZW9mIFdvcmtlcjtcclxuXHR2YXIgcG9zdCA9IGlzV29ya2VyID8gbSA9PiB3LnBvc3RNZXNzYWdlKG0pIDogbSA9PiB3LnBvc3RNZXNzYWdlKG0sIFwiKlwiKTtcclxuXHR2YXIgY2FsbGJhY2tzID0ge307XHJcblx0dmFyIGxhc3RJZCA9IDE7XHJcblx0dmFyIG5ld0lkID0gKCkgPT4gbGFzdElkKys7XHJcblx0dmFyIG9uTWVzc2FnZSA9IG5ldyBTaWduYWwoKTtcclxuXHR2YXIgaXNSZWFkeTtcclxuXHR2YXIgcmVhZHlSZXNwb25zZVNlbnQgPSBmYWxzZTtcclxuXHJcblx0dGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IGlzUmVhZHkgPSByZXNvbHZlKTtcclxuXHJcblx0dmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZSl7XHJcblx0XHRpZighaXNXb3JrZXIgJiYgZS5zb3VyY2UgIT0gdyl7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmKGUuZGF0YSA9PSBSRUFEWSl7XHJcblx0XHRcdGlzUmVhZHkoKTtcclxuXHRcdFx0aWYoIXJlYWR5UmVzcG9uc2VTZW50KXtcclxuXHRcdFx0XHRwb3N0KFJFQURZKTtcclxuXHRcdFx0XHRyZWFkeVJlc3BvbnNlU2VudCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5kYXRhLnJlc3BvbnNlKXtcclxuXHRcdFx0Y2FsbGJhY2tzW2UuZGF0YS5yZXNwb25zZV0oZS5kYXRhLm1zZyk7XHJcblx0XHRcdGRlbGV0ZSBjYWxsYmFja3NbZS5kYXRhLnJlc3BvbnNlXTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRvbk1lc3NhZ2UuZGlzcGF0Y2goZS5kYXRhLm1zZywgbXNnID0+IHBvc3Qoe3Jlc3BvbnNlOiBlLmRhdGEuaWQsIG1zZ30pKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmKGlzV29ya2VyKXtcclxuXHRcdHcub25tZXNzYWdlID0gbGlzdGVuZXI7XHJcblx0fWVsc2V7XHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgbGlzdGVuZXIpO1xyXG5cdH1cclxuXHJcblx0cG9zdChSRUFEWSk7XHJcblx0dGhpcy5wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uKG1zZyl7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHR2YXIgaWQgPSBuZXdJZCgpO1xyXG5cdFx0XHRjYWxsYmFja3NbaWRdID0gcmVzb2x2ZTtcclxuXHRcdFx0cG9zdCh7aWQsIG1zZ30pO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHRoaXMub25NZXNzYWdlID0gb25NZXNzYWdlLm9uO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW11bmljYXRvcjsiLCJpZighc2VsZi53aW5kb3cpeyhmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgQ29tbXVuaWNhdG9yID0gcmVxdWlyZShcIi4vc291bmQvY29tbXVuaWNhdG9yLmpzXCIpO1xyXG5cclxuXHR2YXIgYyA9IG5ldyBDb21tdW5pY2F0b3IoKTtcclxuXHJcblx0bGV0IGlkID0gMTtcclxuXHRsZXQgbmV3SWQgPSBmdW5jdGlvbigpe3JldHVybiBpZCsrfTtcclxuXHRsZXQgc2NyaXB0cyA9IHt9O1xyXG5cclxuXHRjLm9uTWVzc2FnZShmdW5jdGlvbihtc2csIGNiKXtcclxuXHRcdGlmKG1zZy50eXBlID09IFwidGVzdFwiKXtcclxuXHRcdFx0Y2IobXNnLm1zZyArIFwiIGxvbFwiKTtcclxuXHRcdH1lbHNlIGlmKG1zZy50eXBlID09IFwiY29tcGlsZVwiKXtcclxuXHRcdFx0bGV0IHNjcmlwdElkID0gbmV3SWQoKTtcclxuXHRcdFx0c2NyaXB0c1tzY3JpcHRJZF0gPSBldmFsKG1zZy5zY3JpcHQpO1xyXG5cdFx0XHRjYihzY3JpcHRJZCk7XHJcblx0XHR9ZWxzZSBpZihtc2cudHlwZSA9PSBcImNhbGxcIil7XHJcblx0XHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHRcdFx0bGV0IHNjcmlwdCA9IHNjcmlwdHNbbXNnLnNjcmlwdElkXTtcclxuXHRcdFx0Zm9yKGxldCBzdHJpbmcgb2YgbXNnLnN0cmluZ3Mpe1xyXG5cdFx0XHRcdHJlc3VsdCA9IFsuLi5yZXN1bHQsIC4uLnNjcmlwdC5tYWluKHN0cmluZyldO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNiKHJlc3VsdCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59KSgpfVxyXG4iXX0=
