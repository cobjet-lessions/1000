function Scoreboard() {
	var me = this, scores = {};

	this.impls = [];

	this.count = function () {
		return this.impls.length;
	};

	this.register = function (methodName, Impl, input) {
		if (!scores.hasOwnProperty(methodName)) {
			scores[methodName] = { duration: 0, count: 0, input: input };
		}
		var impl = new Impl(function (duration) {
			me.update(methodName, duration);
		});
		this.impls.push(impl);
		return impl;
	};

	this.update = function (methodName, duration) {
		var score = scores[methodName];
		score.duration += duration;
		score.count += 1;
		score.average = (score.duration / score.count).toFixed(0);
		score.input.value = score.average + 'ms';
	};
}