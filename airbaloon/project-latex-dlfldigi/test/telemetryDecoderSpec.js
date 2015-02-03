describe("Telemetry decoder", function() {
	var decoder = require("../telemetryDecoder");

 	it("correctly decodes a valid string with a matching set of keys", function() {
        var result = decoder.decodeTelemetryData("JCRsYXRleCw1NC4yLDIuNTYqMmE5MDA0NTM=", ["project_name", "latitude", "longitude"]);
    	expect(result).toEqual({project_name: "$$latex", latitude: "54.2", longitude: "2.56"});
  	});
    
    it("throws exception if passed a null string", function() {
        expect(function() { decoder.decodeTelemetryData(null, []) }).toThrow("Cannot decode null or empty data");
    });
    
    it("throws exception if passed null keys", function()   {
        expect(function() { decoder.decodeTelemetryData("MSozMjAwMzI=", null) }).toThrow("Cannot decode data with no keys");
    });
    
    it("throws exception if passed empty string", function()   {
        expect(function() { decoder.decodeTelemetryData("", ["someKey"]) }).toThrow("Cannot decode null or empty data");
    });
    
    it("throws exception if passed keys length doesn't match data length", function()   {
        expect(function() { decoder.decodeTelemetryData("MSowMDMyMDAzMg==", ["someKey", "anotherKey"]) }).toThrow("Data doesn't match the keys passed in from the schema");
        expect(function() { decoder.decodeTelemetryData("OTkuOTksOTkuOTksOTkuOTkqMjAwZjAzOGY=", ["someKey", "anotherKey"]) }).toThrow("Data doesn't match the keys passed in from the schema");
    });
    
    it("converts a valid time string to a date object", function() {
        var actual = decoder.convertDateTimeStrings("010214", "12:30:15");
        // Both the decoder and the expected date are running on local time. In the UK this could be either BST or GMT, which will affect the hours value of the date
        var expected = new Date();
        expected.setFullYear(2014,1,1);
        expected.setHours(12);
        expected.setMinutes(30);
        expected.setSeconds(15);
        
        console.log(expected);
        
        expect(actual instanceof Date).toBe(true);
        expect(actual.getFullYear()).toEqual(expected.getFullYear());
        expect(actual.getMonth()).toEqual(expected.getMonth());
        expect(actual.getDate()).toEqual(expected.getDate());
        expect(actual.getHours()).toEqual(expected.getHours());
        expect(actual.getMinutes()).toEqual(expected.getMinutes());
        expect(actual.getSeconds()).toEqual(expected.getSeconds());
    });
    
    it("throws exception if null time string is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings("010223", null) }).toThrow(decoder.invalidTimeStringMessage + ': null');
    });
    
    it("throws exception if undefined time string is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings("010223", undefined) }).toThrow(decoder.invalidTimeStringMessage + ': undefined');
    });
    
    it("throws exception if invalid time string is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "invalid") }).toThrow(decoder.invalidTimeStringMessage + ': invalid');
    });
    
    it("throws exception if invalid time string is passed in with right kind of format, but letters instead of numbers", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "aa:bb:cc") }).toThrow(decoder.invalidTimeStringMessage + ': aa:bb:cc');
    });
    
    it("throws exception if invalid time string is passed in with values out of range for a time", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "55:99:88") }).toThrow(decoder.invalidTimeStringMessage + ': 55:99:88');
    });
    
    it("throws exception if invalid time string is passed in with hours just out of range", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "24:00:12") }).toThrow(decoder.invalidTimeStringMessage + ': 24:00:12');
    });
    
    it("throws exception if invalid time string is passed in with minutes just out of range", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "12:60:12") }).toThrow(decoder.invalidTimeStringMessage + ': 12:60:12');
    });
    
    it("throws exception if invalid time string is passed in with seconds just out of range", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "11:00:60") }).toThrow(decoder.invalidTimeStringMessage + ': 11:00:60');
    });
    
    it("throws exception if invalid time string is passed in with negative values", function() {
        expect(function() { decoder.convertDateTimeStrings("010214", "-11:00:10") }).toThrow(decoder.invalidTimeStringMessage + ': -11:00:10');
    });
    
    it("throws exception if invalid date string is passed in with right kind of format, but letters instead of numbers", function() {
        expect(function() { decoder.convertDateTimeStrings("XXYYXX", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': XXYYXX');
    });
    
    it("throws exception if invalid date string is passed in with letters instead of month", function() {
        expect(function() { decoder.convertDateTimeStrings("01XX45", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': 01XX45');
    });
    
    it("throws exception if invalid date string is passed in with letters instead of year", function() {
        expect(function() { decoder.convertDateTimeStrings("0107YY", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': 0107YY');
    });
    
    it("throws exception if invalid date string with wrong length is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings("toolong", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': toolong');
    });
    
    it("throws exception if invalid date string is passed in with a date out of range", function() {
        expect(function() { decoder.convertDateTimeStrings("500814", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': 500814');
    });
    
    it("throws exception if invalid date string is passed in with the month out of range", function() {
        expect(function() { decoder.convertDateTimeStrings("152214", "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': 152214');
    });
    
    it("throws exception if null date string is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings(null, "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': null');
    });
    
    it("throws exception if undefined date string is passed in", function() {
        expect(function() { decoder.convertDateTimeStrings(undefined, "12:30:15") }).toThrow(decoder.invalidDateStringMessage + ': undefined');
    });
    
    it("verifies valid checksum", function() {
        var result = decoder.verifyChecksum("1234567", "059b016d");
        expect(result).toBeTruthy();
    });
    
    it("verifies real world data and checksum", function() {
        var result = decoder.verifyChecksum("$$latex,0,031214,20:34:40,99.99,99.99,99.99,99.99,99.99,99.99,0.9396369056148697", "d59b1140");
        expect(result).toBeTruthy();
    });
});