"use strict";

// Defines the most basic calculation functions used by the other calculators.

// Calculate the regular repayment to pay off a loan.
// Formula: `p = i * A / 1 - (1 + i)^ -N`.
var pmt = function (principal, effInterestRate, effTerm) {
  var part1 = effInterestRate * principal, part2 = 1 - Math.pow(1 + effInterestRate, -effTerm);

  var result = part1 / part2;

  return result;
};

// Formula: `r = ((FV / PV) ^ (1 / Y)) - 1`
var rateOfReturn = function (pv, fv, y) {
  var r = Math.pow(fv / pv, 1 / y) - 1;

  return r;
};

// Calculate the interest rate per period.
var effInterestRate = function (interestRate, interestRateFrequency, repaymentFrequency) {
  return interestRate * interestRateFrequency / repaymentFrequency;
};

// Calculate the total number of periods for a given loan.
var effTerm = function (term, termFrequency, repaymentFrequency) {
  return term / termFrequency * repaymentFrequency;
};

// Calculate the extra repayment amount per period.
var effExtraRepayment = function (extraRepayment, extraRepaymentFrequency, repaymentFrequency) {
  return extraRepayment * extraRepaymentFrequency / repaymentFrequency;
};

module.exports = {
  pmt: pmt,
  rateOfReturn: rateOfReturn,
  effTerm: effTerm,
  effInterestRate: effInterestRate,
  effExtraRepayment: effExtraRepayment
};