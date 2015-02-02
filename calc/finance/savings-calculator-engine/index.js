"use strict";

var _inherits = function (child, parent) {
  child.prototype = Object.create(parent && parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (parent) child.__proto__ = parent;
};

"use strict";

var LoanCalculatorEngine = require("financial-loan-calculator-engine");

// Savings Calculator Engine extends `LoanCalculatorEngine`
// Calculates a savings plan and its schedule table.
// Example:
// ```
// var SavingsCalculatorEngine = require('financial-savings-calculator-engine');
//
// var savings = new SavingsCalculatorEngine({
// 	principal: 100000,
// 	interestRate: 0.1,
// 	term: 10,
//	repayment: 100
// });
//
// var results = savings.calculate();
// ```
var SavingsCalculatorEngine = (function () {
  var _LoanCalculatorEngine = LoanCalculatorEngine;
  var SavingsCalculatorEngine = function SavingsCalculatorEngine(options) {
    _LoanCalculatorEngine.call(this, options);

    this.config({
      isSavingsMode: true
    });
  };

  _inherits(SavingsCalculatorEngine, _LoanCalculatorEngine);

  return SavingsCalculatorEngine;
})();

module.exports = SavingsCalculatorEngine;