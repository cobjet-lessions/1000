"use strict";

var _ = require("lodash");

var CalculatorEngine = function CalculatorEngine(options) {
  // List of operators ie. `InterestRate`, `ExtraRepayment`, `LumpSum`...
  //
  // Operators can be used to change the calculator context during its
  // active period (between `startPeriod` and `endPeriod`) when they are invoked
  // during the calculation phase. Note that operator periods are inclusive.
  //
  // The last operator added in has the highest priority in the context and will
  // override others if their properties have the same name.
  //
  // See class `Operator` for more info.
  this.__operatorList = [];

  // Configuration.
  // Can be updated using the method `config()`.
  this.__config = {
    frequency: {
      year: 1,
      month: 12,
      fortnight: 26,
      week: 52
    }
  };

  // Base context.
  // This object holds the user's input data for this calculator ie. `principal`, `term`.
  // It will be reset with the options passed into this constructor - see bellow.
  this.__context = {};

  // Update the base context with the options passed in via the constructor.
  this.context(options);
};

// Updates the base context if options are passed in.
// Otherwise returns the context.
CalculatorEngine.prototype.context = function (options) {
  if (options) {
    _.merge(this.__context, options);
    return this;
  }

  return _.clone(this.__context);
};

// Invokes a function passing `this` instance as a parameter.
// Used for register new plugins on this engine.
// Example:
// ```
// var fooResolver = function(instance) {
// 	instance.foo = function() {
// 		// ...
// 	};
// };
// engine.use(fooResolver);
// ```
CalculatorEngine.prototype.use = function () {
  if (arguments) {
    _.forEach(arguments, function (resolver) {
      resolver(this);
    }, this);
  }

  return this;
};

// Updates the configuration if `options` are set
// and returns `this` instance for chaining purpose.
// Otherwise returns the current configurations.
CalculatorEngine.prototype.config = function (options) {
  if (options) {
    _.merge(this.__config, options);
    return this;
  }

  return _.clone(this.__config);
};

// Append an operator to the list
CalculatorEngine.prototype.addOperator = function (operator) {
  return this.__operatorList.push(operator);
};

// Returns all active operators for a given period.
// `startPeriod` less than or equal to `period` and
// `endPeriod` greater than or equal to `period`.
// Note that the operator period is inclusive.
CalculatorEngine.prototype.getOperatorsAt = function (period) {
  return this.__operatorList.filter(function (operator) {
    return operator.startPeriod <= period && operator.endPeriod >= period;
  });
};

module.exports = CalculatorEngine;