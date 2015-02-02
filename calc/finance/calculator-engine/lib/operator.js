"use strict";

var _ = require("lodash");

// Extension plugin for the calculator engines.

var operatorIdCounter = 0;

var Operator = function Operator(type, options) {
  this.id = operatorIdCounter++;
  this.type = type;
  this.startPeriod = 1;
  this.endPeriod = Number.POSITIVE_INFINITY;
  this.context = {};

  _.merge(this, options);
};

Operator.prototype.process = function (context) {
  _.merge(context, this.context);
};

module.exports = Operator;