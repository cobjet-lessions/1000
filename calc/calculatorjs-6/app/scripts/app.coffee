'use strict'

angular.module('calculator3App', [
  'ngResource',
  'ngRoute',
  'ui.keypress',
  'templates-main'
])
  .config ($routeProvider, $locationProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/partials/main.html'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
    $locationProvider.html5Mode(true)