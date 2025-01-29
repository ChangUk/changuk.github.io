function PausableTimer(callback, delay) {
	var _timerId, _start, _remaining = delay;
	var _callback = callback;

	this.pause = function () {
		clearTimeout(_timerId);
		_remaining -= new Date() - _start;
	}
	this.resume = function () {
		_start = new Date();
		clearTimeout(_timerId);
		_timerId = setTimeout(_callback, _remaining);
	}
	this.reset = function (callback, delay) {
		if (callback === null || callback === undefined) _callback = function () {};
		if (delay === null || delay === undefined) _remaining = 0;
		if (typeof(callback) === "function") _callback = callback;
		if (typeof(delay) === "number") _remaining = delay;
		clearTimeout(_timerId);
		_timerId = setTimeout(_callback, _remaining);
	}
	this.remainingtime = function () {
		return _remaining;
	}
}
