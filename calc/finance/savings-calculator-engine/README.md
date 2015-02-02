# savings-calculator-engine [![Build Status](https://travis-ci.org/financial-calcs/savings-calculator-engine.svg?branch=master)](https://travis-ci.org/financial-calcs/savings-calculator-engine)

> Decorates the [Loan repayment calculator engine](https://github.com/financial-calcs/loan-calculator-engine) to provide an easy to use Savings calculator engine.

## Install

```
$ npm install --save financial-savings-calculator-engine
```

## Usage

```javascript
var SavingsCalculatorEngine = require('financial-savings-calculator-engine');
```

### Savings Goal

```javascript
var savings = new SavingsCalculatorEngine({
	principal: 500,
	interestRate: 0.1,
	term: 10,
	repayment: 100
});

var results = savings.calculate();
```

### Term Deposit (Interest paid annually)

```javascript
var savings = new SavingsCalculatorEngine({
	principal: 100000,
	interestRate: 0.1,
	term: 3,
	repaymentFrequency: 1
});

var results = savings.calculate();
```

## To do

- Implement Monthly Goal.
- Implement Time Goal.
- Implement Effective Yield.
- Expand API documentation.

## License

MIT © [Pablo De Nadai](http://pablodenadai.com)
