'use strict';

var _ = require('lodash');

// Extension plugin for the calculator engines.

var operatorIdCounter = 0;

class Operator {
	constructor(type, options) {
		this.id = operatorIdCounter++;
		this.type = type;
		this.startPeriod = 1;
		this.endPeriod = Number.POSITIVE_INFINITY;
		this.context = {};

		_.merge(this, options);
	}

	process(context) {
		_.merge(context, this.context);
	}
}

module.exports = Operator;