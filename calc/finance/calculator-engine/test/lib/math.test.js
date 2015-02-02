/*global describe, it */

'use strict';

var assert = require('assert'),
	_ = require('lodash');

var CalculatorEngineMath = require('../../lib/math');

var helper = {
	round: function(number) {
		if (!_.isNumber(number)) return 0;
		return Math.round(number * 100) / 100;
	}
};

describe('CalculatorEngineMath', function() {
	describe('pmt', function() {
		it('must calculator loan repayment amount', function() {
			var principal = 100000,
				effInterestRate = 0.1 / 12,
				effTerm = 120;

			var pmt = CalculatorEngineMath.pmt(
				principal,
				effInterestRate,
				effTerm
			);

			assert.equal(pmt, 1321.50736881762);
		});
	});

	describe('effTerm', function() {
		it('must calculator effective term (ie. periods)', function() {
			var term = 10,
				termFrequency = 1,
				repaymentFrequency = 12;

			var effTerm = CalculatorEngineMath.effTerm(
				term,
				termFrequency,
				repaymentFrequency
			);

			assert.equal(120, effTerm);
		});
	});

	describe('effInterestRate', function() {
		it('must calculator eff interest rate (ie. per period)', function() {
			var interestRate = 0.1,
				interestRateFrequency = 1,
				repaymentFrequency = 12;

			var effInterestRate = CalculatorEngineMath.effInterestRate(
				interestRate,
				interestRateFrequency,
				repaymentFrequency
			);

			assert.equal(0.1 / 12, effInterestRate);
		});
	});

	describe('rateOfReturn', function() {
		it('must calculate rate of return', function() {
			var pv = 100000,
				fv = 121000,
				y = 2;

			var rateOfReturn = CalculatorEngineMath.rateOfReturn(pv, fv, y);

			assert.equal(0.1, helper.round(rateOfReturn));
		});
	});
});