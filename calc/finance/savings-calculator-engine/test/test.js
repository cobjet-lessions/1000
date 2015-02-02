/*global describe, it */

'use strict';

var assert = require('assert');

var helper = {
	round: function(number) {
		return Math.round(number * 100) / 100;
	}
};

var SavingsCalculatorEngine = require('../.');

describe('savings', function() {
	var savings = new SavingsCalculatorEngine({
		principal: 500,
		interestRate: 0.1,
		term: 10,
		repayment: 100
	});

	var results = savings.calculate();

	it('should calculate the totals', function() {
		var totals = results.totals;

		assert.equal(helper.round(totals.repayment), 12000);
		assert.equal(helper.round(totals.interestPaid), 9338.02);
	});
});

describe('term deposit', function() {
	var savings = new SavingsCalculatorEngine({
		principal: 100000,
		interestRate: 0.1,
		term: 2,
		repaymentFrequency: 1
	});

	var results = savings.calculate();

	it('should calculate the totals', function() {
		var totals = results.totals;

		assert.equal(helper.round(totals.repayment), 0);
		assert.equal(helper.round(totals.interestPaid), 21000);
	});
});