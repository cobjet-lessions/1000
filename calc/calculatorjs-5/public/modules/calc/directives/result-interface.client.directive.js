'use strict';

angular.module('calc').directive('resultInterface', function() {
    return {
        restrict: 'E',
        scope: {
            addItem: '&',
            arrItems: '='
        },
        templateUrl: '/modules/calc/directives/result.interface.template.html',
//        link: function(scope, element) {
//
//        }
    };

});