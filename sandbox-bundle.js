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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzYW5kYm94LmpzIiwic291bmRcXGNvbW11bmljYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxlQUFlLFFBQVEseUJBQVIsQ0FBbkI7O0FBR0EsSUFBSSxJQUFJLElBQUksWUFBSixDQUFpQixPQUFPLE1BQXhCLENBQVI7O0FBRUEsSUFBSSxJQUFJLElBQUksWUFBSixDQUFpQixNQUFqQixDQUFSOztBQUVBLEVBQUUsU0FBRixDQUFZLFVBQUMsR0FBRCxFQUFNLEVBQU4sRUFBYTtBQUN4QixTQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxHQUFuQztBQUNBLEdBQUUsV0FBRixDQUFjLEdBQWQsRUFBbUIsSUFBbkIsQ0FBd0IsRUFBeEI7QUFDQSxDQUhEOztBQUtBLFFBQVEsR0FBUixDQUFZLENBQUMsRUFBRSxLQUFILEVBQVUsRUFBRSxLQUFaLENBQVosRUFDQyxJQURELENBQ00sWUFBTTtBQUFDLFNBQVEsR0FBUixDQUFZLE9BQVosRUFBc0IsRUFBRSxXQUFGLENBQWMsV0FBZDtBQUEyQixDQUQ5RDs7QUFHQSxRQUFRLEdBQVIsQ0FBWSxPQUFaOzs7OztBQ2ZBLElBQU0sUUFBUSxtQkFBZDs7QUFFQSxTQUFTLE1BQVQsR0FBaUI7QUFDaEIsS0FBSSxNQUFNLEVBQVY7QUFDQSxNQUFLLEVBQUwsR0FBVSxVQUFTLEVBQVQsRUFBWTtBQUNyQixNQUFJLElBQUosQ0FBUyxFQUFUO0FBQ0EsRUFGRDtBQUdBLE1BQUssUUFBTCxHQUFnQixZQUFpQjtBQUFBLG9DQUFMLElBQUs7QUFBTCxPQUFLO0FBQUE7O0FBQ2hDLE1BQUksT0FBSixDQUFZO0FBQUEsVUFBTSxvQkFBTSxJQUFOLENBQU47QUFBQSxHQUFaO0FBQ0EsRUFGRDtBQUdBOztBQUVELFNBQVMsWUFBVCxDQUFzQixDQUF0QixFQUF3QjtBQUN2QixLQUFJLEtBQUssSUFBVDtBQUNBLEtBQUksSUFBSSxJQUFSO0FBQ0EsS0FBSSxXQUFXLENBQUMsS0FBSyxNQUFOLElBQWdCLGFBQWEsTUFBNUM7QUFDQSxLQUFJLE9BQU8sV0FBVztBQUFBLFNBQUssRUFBRSxXQUFGLENBQWMsQ0FBZCxDQUFMO0FBQUEsRUFBWCxHQUFtQztBQUFBLFNBQUssRUFBRSxXQUFGLENBQWMsQ0FBZCxFQUFpQixHQUFqQixDQUFMO0FBQUEsRUFBOUM7QUFDQSxLQUFJLFlBQVksRUFBaEI7QUFDQSxLQUFJLFNBQVMsQ0FBYjtBQUNBLEtBQUksUUFBUSxTQUFSLEtBQVE7QUFBQSxTQUFNLFFBQU47QUFBQSxFQUFaO0FBQ0EsS0FBSSxZQUFZLElBQUksTUFBSixFQUFoQjtBQUNBLEtBQUksT0FBSjtBQUNBLEtBQUksb0JBQW9CLEtBQXhCOztBQUVBLE1BQUssS0FBTCxHQUFhLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVY7QUFBQSxTQUFxQixVQUFVLE9BQS9CO0FBQUEsRUFBWixDQUFiOztBQUVBLEtBQUksV0FBVyxTQUFYLFFBQVcsQ0FBUyxDQUFULEVBQVc7QUFDekIsTUFBRyxDQUFDLFFBQUQsSUFBYSxFQUFFLE1BQUYsSUFBWSxDQUE1QixFQUE4QjtBQUM3QjtBQUNBO0FBQ0QsTUFBRyxFQUFFLElBQUYsSUFBVSxLQUFiLEVBQW1CO0FBQ2xCO0FBQ0EsT0FBRyxDQUFDLGlCQUFKLEVBQXNCO0FBQ3JCLFNBQUssS0FBTDtBQUNBLHdCQUFvQixJQUFwQjtBQUNBO0FBQ0Q7QUFDQTtBQUNELE1BQUcsRUFBRSxJQUFGLENBQU8sUUFBVixFQUFtQjtBQUNsQixhQUFVLEVBQUUsSUFBRixDQUFPLFFBQWpCLEVBQTJCLEVBQUUsSUFBRixDQUFPLEdBQWxDO0FBQ0EsVUFBTyxVQUFVLEVBQUUsSUFBRixDQUFPLFFBQWpCLENBQVA7QUFDQSxHQUhELE1BR0s7QUFDSixhQUFVLFFBQVYsQ0FBbUIsRUFBRSxJQUFGLENBQU8sR0FBMUIsRUFBK0I7QUFBQSxXQUFPLEtBQUssRUFBQyxVQUFVLEVBQUUsSUFBRixDQUFPLEVBQWxCLEVBQXNCLFFBQXRCLEVBQUwsQ0FBUDtBQUFBLElBQS9CO0FBQ0E7QUFDRCxFQWxCRDs7QUFvQkEsS0FBRyxRQUFILEVBQVk7QUFDWCxJQUFFLFNBQUYsR0FBYyxRQUFkO0FBQ0EsRUFGRCxNQUVLO0FBQ0osU0FBTyxnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxRQUFuQztBQUNBOztBQUVELE1BQUssS0FBTDtBQUNBLE1BQUssV0FBTCxHQUFtQixVQUFTLEdBQVQsRUFBYTtBQUMvQixTQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdkMsT0FBSSxLQUFLLE9BQVQ7QUFDQSxhQUFVLEVBQVYsSUFBZ0IsT0FBaEI7QUFDQSxRQUFLLEVBQUMsTUFBRCxFQUFLLFFBQUwsRUFBTDtBQUNBLEdBSk0sQ0FBUDtBQUtBLEVBTkQ7O0FBUUEsTUFBSyxTQUFMLEdBQWlCLFVBQVUsRUFBM0I7QUFDQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENvbW11bmljYXRvciA9IHJlcXVpcmUoXCIuL3NvdW5kL2NvbW11bmljYXRvci5qc1wiKTtcclxuXHJcblxyXG52YXIgYyA9IG5ldyBDb21tdW5pY2F0b3Iod2luZG93LnBhcmVudCk7XHJcblxyXG52YXIgdyA9IG5ldyBDb21tdW5pY2F0b3Iod29ya2VyKTtcclxuXHJcbmMub25NZXNzYWdlKChtc2csIGNiKSA9PiB7XHJcblx0Y29uc29sZS5sb2coXCJzYW5kYm94IGdvdCBtZXNzYWdlXCIsIG1zZyk7XHJcblx0dy5wb3N0TWVzc2FnZShtc2cpLnRoZW4oY2IpO1xyXG59KTtcclxuXHJcblByb21pc2UuYWxsKFtjLnJlYWR5LCB3LnJlYWR5XSlcclxuLnRoZW4oKCkgPT4ge2NvbnNvbGUubG9nKFwicmVhZHlcIik7IGMucG9zdE1lc3NhZ2UoXCJjb25uZWN0ZWRcIil9KTtcclxuXHJcbmNvbnNvbGUubG9nKFwibG9vb2xcIik7IiwiY29uc3QgUkVBRFkgPSBcImltY29tcGxldGVseXJlYWR5XCI7XHJcblxyXG5mdW5jdGlvbiBTaWduYWwoKXtcclxuXHR2YXIgY2JzID0gW107XHJcblx0dGhpcy5vbiA9IGZ1bmN0aW9uKGNiKXtcclxuXHRcdGNicy5wdXNoKGNiKTtcclxuXHR9XHJcblx0dGhpcy5kaXNwYXRjaCA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xyXG5cdFx0Y2JzLmZvckVhY2goY2IgPT4gY2IoLi4uYXJncykpO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gQ29tbXVuaWNhdG9yKHcpe1xyXG5cdHcgPSB3IHx8IHNlbGY7XHJcblx0dmFyIGMgPSB0aGlzO1xyXG5cdHZhciBpc1dvcmtlciA9ICFzZWxmLldvcmtlciB8fCB3IGluc3RhbmNlb2YgV29ya2VyO1xyXG5cdHZhciBwb3N0ID0gaXNXb3JrZXIgPyBtID0+IHcucG9zdE1lc3NhZ2UobSkgOiBtID0+IHcucG9zdE1lc3NhZ2UobSwgXCIqXCIpO1xyXG5cdHZhciBjYWxsYmFja3MgPSB7fTtcclxuXHR2YXIgbGFzdElkID0gMTtcclxuXHR2YXIgbmV3SWQgPSAoKSA9PiBsYXN0SWQrKztcclxuXHR2YXIgb25NZXNzYWdlID0gbmV3IFNpZ25hbCgpO1xyXG5cdHZhciBpc1JlYWR5O1xyXG5cdHZhciByZWFkeVJlc3BvbnNlU2VudCA9IGZhbHNlO1xyXG5cclxuXHR0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gaXNSZWFkeSA9IHJlc29sdmUpO1xyXG5cclxuXHR2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihlKXtcclxuXHRcdGlmKCFpc1dvcmtlciAmJiBlLnNvdXJjZSAhPSB3KXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYoZS5kYXRhID09IFJFQURZKXtcclxuXHRcdFx0aXNSZWFkeSgpO1xyXG5cdFx0XHRpZighcmVhZHlSZXNwb25zZVNlbnQpe1xyXG5cdFx0XHRcdHBvc3QoUkVBRFkpO1xyXG5cdFx0XHRcdHJlYWR5UmVzcG9uc2VTZW50ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZihlLmRhdGEucmVzcG9uc2Upe1xyXG5cdFx0XHRjYWxsYmFja3NbZS5kYXRhLnJlc3BvbnNlXShlLmRhdGEubXNnKTtcclxuXHRcdFx0ZGVsZXRlIGNhbGxiYWNrc1tlLmRhdGEucmVzcG9uc2VdO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdG9uTWVzc2FnZS5kaXNwYXRjaChlLmRhdGEubXNnLCBtc2cgPT4gcG9zdCh7cmVzcG9uc2U6IGUuZGF0YS5pZCwgbXNnfSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYoaXNXb3JrZXIpe1xyXG5cdFx0dy5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcclxuXHR9ZWxzZXtcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBsaXN0ZW5lcik7XHJcblx0fVxyXG5cclxuXHRwb3N0KFJFQURZKTtcclxuXHR0aGlzLnBvc3RNZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdHZhciBpZCA9IG5ld0lkKCk7XHJcblx0XHRcdGNhbGxiYWNrc1tpZF0gPSByZXNvbHZlO1xyXG5cdFx0XHRwb3N0KHtpZCwgbXNnfSk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0dGhpcy5vbk1lc3NhZ2UgPSBvbk1lc3NhZ2Uub247XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29tbXVuaWNhdG9yOyJdfQ==
