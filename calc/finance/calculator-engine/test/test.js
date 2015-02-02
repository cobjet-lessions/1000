/*global describe, it */

'use strict';

var assert = require('assert');

var CalculatorEngine = require('../.'),
	CalculatorEngineOperator = require('../lib/operator');

describe('CalculatorEngine', function() {
	describe('addOperator', function() {
		it('must add the operator to the `operatorList` array', function() {
			var engine = new CalculatorEngine();

			var operator = new CalculatorEngineOperator('test');
			engine.addOperator(operator);

			assert.equal(operator, engine.__operatorList[0]);
		});
	});

	describe('getOperatorsAt', function() {
		it('must retrieve the operator from the `operatorList` array', function() {
			var engine = new CalculatorEngine();

			var operator = new CalculatorEngineOperator('test');
			operator.startPeriod = 10;
			operator.endPeriod = 50;
			engine.addOperator(operator);

			var operatorList = engine.getOperatorsAt(15);

			assert.equal(1, engine.__operatorList.length);
		});
	});

	describe('use', function() {
		it('must invoke a function passing the engine\'s instance as the paramenter', function() {
			var engine = new CalculatorEngine();

			var foo = function(param) {
				assert.equal(param, engine);
			};

			engine.use(foo);
		});
	});

	describe('config', function() {
		it('must retrieve the config', function() {
			var engine = new CalculatorEngine();

			assert.deepEqual(engine.__config, {
				frequency: {
					year: 1,
					month: 12,
					fortnight: 26,
					week: 52
				}
			});
		});

		it('must update the config if an object is given', function() {
			var engine = new CalculatorEngine();

			engine.config({
				frequency: {
					fortnight: 26.1,
					week: 52.2
				}
			});

			assert.deepEqual(engine.__config, {
				frequency: {
					year: 1,
					month: 12,
					fortnight: 26.1,
					week: 52.2
				}
			});
		});

		it('must return the engine instance if an object is given (ie. chaining)', function() {
			var engine = new CalculatorEngine();

			var options = {
				frequency: {
					fortnight: 26.1,
					week: 52.2
				}
			};

			var chain = engine.config(options);

			assert.equal(chain, engine);
		});
	});
});