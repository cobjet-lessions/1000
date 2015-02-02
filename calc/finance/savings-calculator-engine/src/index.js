'use strict';

var LoanCalculatorEngine = require('financial-loan-calculator-engine');

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
class SavingsCalculatorEngine extends LoanCalculatorEngine {
	constructor(options) {
		super(options);

		this.config({
			isSavingsMode: true
		});
	}
}

module.exports = SavingsCalculatorEngine;