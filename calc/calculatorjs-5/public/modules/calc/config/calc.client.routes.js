'use strict';

//Setting up route
angular.module('calc').config(['$stateProvider',
	function($stateProvider) {
		// Calc state routing
		$stateProvider.
		state('calculator', {
			url: '/calculator',
			templateUrl: 'modules/calc/views/calculator.client.view.html'
		});
	}
]);