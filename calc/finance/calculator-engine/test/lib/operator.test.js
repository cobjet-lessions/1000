/*global describe, it */

'use strict';

var assert = require('assert');

var CalculatorEngineOperator = require('../../lib/operator');

describe('CalculatorEngineOperator', function() {
	it('must instanciate the operator with the operator type', function() {
		var myOperator = new CalculatorEngineOperator('operator-type');

		assert.equal('operator-type', myOperator.type);
	});
});