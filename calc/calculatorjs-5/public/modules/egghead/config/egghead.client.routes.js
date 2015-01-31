'use strict';

//Setting up route
angular.module('egghead').config(['$stateProvider',
	function($stateProvider) {
		// Egghead state routing
		$stateProvider.
		state('assignment01-view', {
			url: '/assignment01-view',
			templateUrl: 'modules/egghead/views/assignment01-view.client.view.html'
		})
	}
]);