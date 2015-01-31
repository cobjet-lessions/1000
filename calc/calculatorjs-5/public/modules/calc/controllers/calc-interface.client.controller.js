'use strict';

angular.module('calc').controller('calcInterfaceCtrl', ["$scope", "calcService",
    function($scope, calcService) {
        $scope.calcExpression = "";
        $scope.clickNum = function () {
            console.log("click num! num : ");
        }
        $scope.calc = function () {
            console.log("calc() invoked!");
            console.log("calcExpression : {{calcExpression}}");
            calcService.doTest();
            console.log($scope.calcExpression);
            calcService.expression = $scope.calcExpression;
            calcService.doCalc();
            //calcService.doCalc(calcExpression);
            $scope.calcExpression = "";

        }
    }
]);