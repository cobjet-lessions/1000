'use strict';

/* Controllers */

var latexModule = angular.module('projectLatexApp.controllers', []);

latexModule.service('GoogleMaps', function () {
    function initialiseFlightPath (latLngPositions) {
        if (latLngPositions === undefined || latLngPositions === null) {
            throw(undefinedPositionsArrayErrorMessage);
        }
        
        var flightPath = new google.maps.Polyline({
            path: latLngPositions,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        return flightPath;
    }
    
    var undefinedPositionsArrayErrorMessage = 'Cannot create flight path with undefined or null array of positions',
        appendToUndefinedFlightPathErrorMessage = 'Cannot append to undefined or null flight path',
        appendUndefinedPositionErrorMessage = 'Cannot append undefined or null position';
    
    return {
        addMarker: function (position, map) {
            var marker = new google.maps.Marker({
                position: position,
                map: map
            });
            return marker;
        },
        createMap: function (domElement) {
            var mapOptions = {
                center: new google.maps.LatLng(0, 0),
                zoom: 2
            };
            return new google.maps.Map(domElement, mapOptions);
        },
        createLatLng: function (latitude, longitude) {
            return new google.maps.LatLng(latitude, longitude);
        },
        centerAndZoomMap: function (map, latLng, zoomLevel) {
            map.setCenter(latLng);
            map.setZoom(zoomLevel);
        },
        initialiseFlightPath: initialiseFlightPath,
        initialiseFlightPathOnMap: function (map, latLngPositions) {
            var flightPath = initialiseFlightPath(latLngPositions);
            flightPath.setMap(map);
            return flightPath;
        },
        appendToFlightPath: function (flightPath, latLng) {
            if (flightPath === undefined || flightPath === null) {
                throw(appendToUndefinedFlightPathErrorMessage);
            }
            if (latLng === undefined || latLng === null) {
                throw(appendUndefinedPositionErrorMessage);
            }
            
            var coords = flightPath.getPath();
            var flightPathEnd = coords.getAt(coords.length - 1);
            if (!latLng.equals(flightPathEnd)) {
                coords.push(latLng);
            }
        },
        undefinedPositionsArrayErrorMessage: undefinedPositionsArrayErrorMessage,
        appendToUndefinedFlightPathErrorMessage: appendToUndefinedFlightPathErrorMessage,
        appendUndefinedPositionErrorMessage: appendUndefinedPositionErrorMessage
    };
});

latexModule.controller('TelemetryCtrl', ['$scope', '$http', '$interval', 'GoogleMaps', function ($scope, $http, $interval, GoogleMaps) {      
    function showNoData() {
        var noDataString = "No data";
        $scope.payload_name = noDataString;
        $scope.time = noDataString;
        $scope.altitude = noDataString;
        $scope.latitude = noDataString;
        $scope.longitude = noDataString;
        $scope.speed = noDataString;
        $scope.heading = noDataString;
        $scope.temp_internal = noDataString;
        $scope.temp_external = noDataString;
    }
      
    function formatDateString(dateString) {
        var date = new Date(dateString);
        return date.toString();
    }
    
    function initialiseFlightPathOnMap() {
        $http.get('http://project-latex-database-server.herokuapp.com/historical?latitude&longitude')
            .success(function (data) {
                // TODO: Until we have valid data from the server we'll use mock data
                data = [{'latitude':52, 'longitude':-1.5},
                        {'latitude':51.5, 'longitude':-2},
                       {'latitude':51.4, 'longitude':-2.6}];
                var latLngPositions = [];
                for (var i = 0; i < data.length; ++i) {
                    var dataObject = data[i];
                    var latLng = GoogleMaps.createLatLng(dataObject.latitude, dataObject.longitude);
                    latLngPositions[i] = latLng;
                }
                $scope.flightPath = GoogleMaps.initialiseFlightPathOnMap($scope.map, latLngPositions);
            });
    }
      
    function queryDatabaseServer() {
        $http.get('http://project-latex-database-server.herokuapp.com/latest')
            .success(function (data) {
                if (jQuery.isEmptyObject(data)) {
                    showNoData();
                } else {
                    $scope.payload_name = data.payload_name;
                    $scope.time = formatDateString(data.time);
                    $scope.altitude = data.altitude;
                    $scope.latitude = data.latitude;
                    $scope.longitude = data.longitude;
                    $scope.speed = data.speed;
                    $scope.heading = data.heading;
                    $scope.temp_internal = data.temp_internal;
                    $scope.temp_external = data.temp_external;

                    if (typeof $scope.map === 'undefined') {
                        $scope.map = GoogleMaps.createMap(document.getElementById('map-canvas'));
                    }

                    // TODO: Use lat and long when we have real values
                    var latLng = GoogleMaps.createLatLng(51.4, -2.6);

                    if (!$scope.mapCenteredOnInitialData) {
                        GoogleMaps.centerAndZoomMap($scope.map, latLng, 8);
                        initialiseFlightPathOnMap();
                        $scope.mapCenteredOnInitialData = true;
                    }

                    if (typeof $scope.balloonMarker === 'undefined') {
                        $scope.balloonMarker = GoogleMaps.addMarker(latLng, $scope.map);
                    } else {
                        $scope.balloonMarker.setPosition(latLng);
                        GoogleMaps.appendToFlightPath($scope.flightPath, latLng);
                    }
                }
            })
            .error(function (err) {
                showNoData();
            });
    }
    
    $scope.queryDatabaseServer = queryDatabaseServer;
      
    // Do an initial query
    queryDatabaseServer();
    // Now query every second
    $interval(queryDatabaseServer, 1000);
}]);
