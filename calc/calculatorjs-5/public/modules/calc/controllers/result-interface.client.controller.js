'use strict';

angular.module('calc').controller('calcHistoryCtrl', ["$scope", "calcService", function($scope, calcService){
    $scope.calcResultArr = calcService.arrResultItem;
}]);