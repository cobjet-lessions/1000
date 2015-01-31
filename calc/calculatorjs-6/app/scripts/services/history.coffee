'use strict'

angular.module('calculator3App')
	.service 'History', ($resource) ->

		return $resource '/api/history/:id', { id: '@id'}, {
			getAll: {method: 'GET', url: '/api/history', isArray: true}
		}
