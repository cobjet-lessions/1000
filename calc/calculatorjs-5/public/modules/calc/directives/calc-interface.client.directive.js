'use strict';

angular.module('calc').directive('calcInterface', function() {
    return{
        restrict: 'E',
        scope:        {
            //clickNum: '&clickNum'
            directiveCalcExpression: '=ctrlExpression',
            calc: "&"
        },
        templateUrl: '/modules/calc/directives/calc.interface.template.html',
        link: function(scope, element) {
            scope.clickExpBtn = function(event) {
                //console.log("clikc num!, message:{{message}}");
                var inputExp = event.currentTarget.innerHTML;
                console.log(inputExp);
                scope.directiveCalcExpression += inputExp;
                //scope.directiveCalcExpression = "aaa";
            }

            scope.clickEqual = function(scope, element) {
                console.log("click equal!");
                scope.calc();
            }
        }
    };
});