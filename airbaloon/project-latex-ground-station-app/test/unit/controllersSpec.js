'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    var scope, ctrl, $httpBackend, 
        mockMaps = {
            addMarker: function (position, map) {
                return mockMarker;
            },
            createMap: function (domElement) {
                return {};
            },
            createLatLng: function (latitude, longitude) {
                return {};
            },
            centerAndZoomMap: function (map, latLng, zoomLevel) {
                // Do nothing
            },
            initialiseFlightPath: function (latLngPositions) {
                // Do nothing
            },
            initialiseFlightPathOnMap: function (map, latLngPositions) {
                // Do nothing
            },
            appendToFlightPath: function (map, flightPath, latLng) {
                // Do nothing
            }
        }, 
        mockMarker = {
            setPosition: function(position) {
                // Do nothing
            }
        };
    
    beforeEach(module('projectLatexApp.controllers'));
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        
        ctrl = $controller('TelemetryCtrl', { $scope: scope, GoogleMaps: mockMaps });
    }));

    it('should be defined', inject(function($controller) {
        //spec body
        expect(ctrl).toBeDefined();
    }));
    
    it('should display the no data labels when query to server fails', function() {
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({});
        
        $httpBackend.flush();
        
        expect(scope.payload_name).toEqual('No data');
        expect(scope.time).toEqual('No data');
        expect(scope.altitude).toEqual('No data');
        expect(scope.latitude).toEqual('No data');
        expect(scope.longitude).toEqual('No data');
        expect(scope.speed).toEqual('No data');
        expect(scope.heading).toEqual('No data');
    });
    
    it('should display data when it is available', function() {
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({
            payload_name:"$$latex",
            time:"12:19:03",
            altitude:12345,
            latitude:54.2,
            longitude:-2.6,
            speed:1.23,
            heading:0.34
        });
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/historical?latitude&longitude').respond({});
        
        $httpBackend.flush();
        
        expect(scope.payload_name).toEqual('$$latex');
        expect(scope.altitude).toEqual(12345);
        expect(scope.latitude).toEqual(54.2);
        expect(scope.longitude).toEqual(-2.6);
        expect(scope.speed).toEqual(1.23);
        expect(scope.heading).toEqual(0.34);
    });
    
    it('should create map, center it, and add marker when data is available', function() {
        spyOn(mockMaps, 'createMap');
        spyOn(mockMaps, 'centerAndZoomMap');
        spyOn(mockMaps, 'addMarker').andCallThrough();
        spyOn(mockMaps, 'initialiseFlightPathOnMap');
        spyOn(mockMaps, 'appendToFlightPath');
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({
            payload_name:"$$latex",
            time:"12:19:03",
            altitude:12345,
            latitude:54.2,
            longitude:-2.6,
            speed:1.23,
            heading:0.34
        });
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/historical?latitude&longitude').respond({});
        
        $httpBackend.flush();
        
        expect(mockMaps.createMap).toHaveBeenCalled();
        expect(mockMaps.centerAndZoomMap).toHaveBeenCalled();
        expect(mockMaps.addMarker).toHaveBeenCalled();
        expect(mockMaps.initialiseFlightPathOnMap).toHaveBeenCalled();
        expect(mockMaps.appendToFlightPath.callCount).toEqual(0);
        expect(scope.mapCenteredOnInitialData).toBe(true);
        expect(scope.balloonMarker).toBe(mockMarker);
    });
    
    it('should append latest position to flight path once flight path has been initialised', function() {
        spyOn(mockMaps, 'appendToFlightPath');
        spyOn(mockMaps, 'initialiseFlightPathOnMap');
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({
            payload_name:"$$latex",
            time:"12:19:03",
            altitude:12345,
            latitude:54.2,
            longitude:-2.6,
            speed:1.23,
            heading:0.34
        });
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/historical?latitude&longitude').respond({});
        
        $httpBackend.flush();
        
        expect(mockMaps.initialiseFlightPathOnMap).toHaveBeenCalled();
        expect(mockMaps.appendToFlightPath.callCount).toEqual(0);
        
        // Now we make another query to the server
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({
            payload_name:"$$latex",
            time:"12:19:03",
            altitude:12345,
            latitude:54.2,
            longitude:-2.6,
            speed:1.23,
            heading:0.34
        });
        
        scope.queryDatabaseServer();
        
        $httpBackend.flush();
        
        expect(mockMaps.appendToFlightPath.callCount).toEqual(1);
    });
    
    it('should not create map when no data is available', function() {
        spyOn(mockMaps, 'createMap');
        spyOn(mockMaps, 'centerAndZoomMap');
        spyOn(mockMaps, 'addMarker');
        
        $httpBackend.expectGET('http://project-latex-database-server.herokuapp.com/latest').respond({
        });
        
        $httpBackend.flush();
        
        expect(mockMaps.createMap.callCount).toEqual(0);
        expect(mockMaps.centerAndZoomMap.callCount).toEqual(0);
        expect(mockMaps.addMarker.callCount).toEqual(0);
        expect(scope.map).toBeUndefined();
    });
});

describe('Google maps service', function() {
    var googleMapsService;
    
    beforeEach(module('projectLatexApp.controllers'));
    
    beforeEach(inject(function(_GoogleMaps_) {
        googleMapsService = _GoogleMaps_;
    }));
    
    describe('Initialise flight path', function() {
        it('should initialise flight path when given valid data', function() {
            var latLngPositions = [];
            for (var i = 0; i < 10; ++i) {
                latLngPositions[i] = googleMapsService.createLatLng(i, i);
            }

            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            var coords = flightPath.getPath();
            expect(coords.getLength()).toEqual(10);
            for (var i = 0; i < 10; ++i) {
                expect(coords.getAt(i).lat()).toEqual(i);
                expect(coords.getAt(i).lng()).toEqual(i);
            }
        });

        it('should return empty flight path when given empty data', function() {
            var latLngPositions = [];
            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            var coords = flightPath.getPath();
            expect(coords.getLength()).toEqual(0);
        });

        it('should throw when given an undefined array', function() {
            var latLngPositions;
            expect(function() { googleMapsService.initialiseFlightPath(latLngPositions); }).toThrow(googleMapsService.undefinedPositionsArrayErrorMessage);
        });
        
        it('should throw when given a null array', function() {
            expect(function() { googleMapsService.initialiseFlightPath(null); }).toThrow(googleMapsService.undefinedPositionsArrayErrorMessage);
        });
    });
    
    describe('Append to flight path', function() {
        it('should append to a flight path when given a valid position', function() {
            var latLngPositions = [];
            for (var i = 0; i < 10; ++i) {
                latLngPositions[i] = googleMapsService.createLatLng(i, i);
            }

            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            var latLng = googleMapsService.createLatLng(15, 10);
            googleMapsService.appendToFlightPath(flightPath, latLng);
            var coords = flightPath.getPath();
            expect(coords.getLength()).toEqual(11);
            for (var i = 0; i < 10; ++i) {
                expect(coords.getAt(i).lat()).toEqual(i);
                expect(coords.getAt(i).lng()).toEqual(i);
            }
            expect(coords.getAt(10).lat()).toEqual(15);
            expect(coords.getAt(10).lng()).toEqual(10);
        });
        
        it('should throw if flight path is undefined', function() {
            var latLng = googleMapsService.createLatLng(15, 10);
            expect(function() { googleMapsService.appendToFlightPath(undefined, latLng); }).toThrow(googleMapsService.appendToUndefinedFlightPathErrorMessage);
        });
        
        it('should throw if flight path is null', function() {
            var latLng = googleMapsService.createLatLng(15, 10);
            expect(function() { googleMapsService.appendToFlightPath(null, latLng); }).toThrow(googleMapsService.appendToUndefinedFlightPathErrorMessage);
        });
        
        it('should throw if new position is undefined', function() {
            var latLngPositions = [];
            for (var i = 0; i < 10; ++i) {
                latLngPositions[i] = googleMapsService.createLatLng(i, i);
            }

            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            expect(function() { googleMapsService.appendToFlightPath(flightPath, undefined); }).toThrow(googleMapsService.appendUndefinedPositionErrorMessage);
        });
        
        it('should throw if new position is null', function() {
            var latLngPositions = [];
            for (var i = 0; i < 10; ++i) {
                latLngPositions[i] = googleMapsService.createLatLng(i, i);
            }

            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            expect(function() { googleMapsService.appendToFlightPath(flightPath, null); }).toThrow(googleMapsService.appendUndefinedPositionErrorMessage);
        });
        
        it('should not append position if it is the same as the last position in the flight path', function() {
            var latLngPositions = [];
            for (var i = 0; i < 10; ++i) {
                latLngPositions[i] = googleMapsService.createLatLng(i, i);
            }

            var flightPath = googleMapsService.initialiseFlightPath(latLngPositions);
            var coords = flightPath.getPath();
            expect(coords.getLength()).toEqual(10);
            
            var latLng = googleMapsService.createLatLng(9, 9);
            googleMapsService.appendToFlightPath(flightPath, latLng);
            
            coords = flightPath.getPath();
            expect(coords.getLength()).toEqual(10);
            expect(coords.getAt(9).lat()).toEqual(9);
            expect(coords.getAt(9).lng()).toEqual(9);
        });
    });
});