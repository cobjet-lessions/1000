'use strict'

angular.module('calculator3App')
  .directive 'calculator', () ->
	templateUrl: 'views/directives/calculator.html'
	restrict: 'E'
	controller: ($scope, $timeout, $rootScope, History) ->

		$scope.input = ""
		$scope.history = History.getAll () ->
			$scope.history.reverse()

		$scope.reset = () ->
			$scope.input = ""

		$scope.write = (c) ->
			$scope.input += c

		addToHistory = (calcul) ->
			$scope.history.unshift {calcul: calcul}
			history = new History({calcul: calcul})
			history.$save()

		calculScope = $rootScope.$new()
		$scope.calculate = () ->
			try
				regexp = /^[0-9+%\-()^*/ .]+$/
				if !regexp.test($scope.input) then throw new Error()
				result = calculScope.$eval $scope.input
				addToHistory $scope.input
				$scope.input = result
			catch error
				$scope.error = "Invalid calculation"

		timer = null
		$scope.$watch 'error', () ->
			if timer then $timeout.cancel timer
			timer = $timeout () ->
				$scope.error = null
			, 2000