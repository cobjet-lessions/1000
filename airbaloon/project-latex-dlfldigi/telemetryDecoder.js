'use strict';

var Adler32 = require("adler32-js");

var invalidTimeStringMessage = "Invalid time string passed to decoder";
var invalidDateStringMessage = "Invalid date string passed to decoder";

function decodeTelemetryData (base64data, telemetryKeys)    {
    if (base64data === null || base64data === "")    {
        throw "Cannot decode null or empty data";
    }
    if (telemetryKeys === null || telemetryKeys.length === 0) {
        throw "Cannot decode data with no keys";
    }
    
    var buffer = new Buffer(base64data, 'base64');
    var decodedDataStringWithChecksum = buffer.toString();
    // Split the string to separate out the checksum at the end
    var dataAndChecksum = decodedDataStringWithChecksum.split('*');
    var decodedDataString = dataAndChecksum[0];
    var checksum = dataAndChecksum[1];
    
    if (!verifyChecksum(decodedDataString, checksum)) {
        throw "Data doesn't match checksum. Data is: " + decodedDataString + ". Checksum is: " + checksum;
    }
    
    // The data is comma-separated, so get the individual values
    var telemetryArray = decodedDataString.split(',');
    
    if (telemetryArray.length != telemetryKeys.length)  {
        throw "Data doesn't match the keys passed in from the schema";
    }
    
    // Now match up the values with the associated keys in the telemetry schema
    var telemetryInfo = {};
    for (var i = 0; i < telemetryKeys.length; ++i) {
        telemetryInfo[telemetryKeys[i]] = telemetryArray[i];
    }
    
    return telemetryInfo;
}

function verifyChecksum(dataString, checksum) {
    var hash = new Adler32();
    hash.update(dataString);
    return checksum === hash.digest('hex');
}

// We expect a string with the format DDMMYY
function parseDateString(dateString) {
    if (dateString === null || dateString === undefined || dateString.length != 6) {
        throw invalidDateStringMessage + ': ' + dateString;
    }
    var dayString = dateString.substring(0, 2);
    var monthString = dateString.substring(2, 4);
    var yearString = dateString.substring(4, 6);
    
    var day = parseInt(dayString);
    if (isNaN(day) || day < 1 || day > 31) {
        throw invalidDateStringMessage + ': ' + dateString;
    }
    var month = parseInt(monthString);
    if (isNaN(month) || month < 1 || month > 12) {
        throw invalidDateStringMessage + ': ' + dateString;
    }
    // We're assuming this century, which is ok for our particular use case
    var yearsSinceMillenium = parseInt(yearString);
    if (isNaN(yearsSinceMillenium)) {
        throw invalidDateStringMessage + ': ' + dateString;
    }
    var year = 2000 + yearsSinceMillenium;
    
    var date = new Date();
    date.setFullYear(year, month - 1, day);
    return date;
}

function convertDateTimeStrings(dateString, timeString) {
    var date = parseDateString(dateString);
    
    if (timeString === null || timeString === undefined) {
        throw invalidTimeStringMessage + ': ' + timeString;
    }
    var timeComponents = timeString.split(':');
    if (timeComponents.length != 3) {
        throw invalidTimeStringMessage + ': ' + timeString;
    }
    
    var numericTimeComponents = [];
    for (var i = 0; i < timeComponents.length; ++i) {
        var num = parseInt(timeComponents[i]);
        if (isNaN(num) || num < 0) {
            throw invalidTimeStringMessage + ': ' + timeString;
        }
        numericTimeComponents[i] = num;
    }
    if (numericTimeComponents[0] > 23
       || numericTimeComponents[1] > 59
       || numericTimeComponents[2] > 59) {
        throw invalidTimeStringMessage + ': ' + timeString;
    }
    
    date.setHours(numericTimeComponents[0]);
    date.setMinutes(numericTimeComponents[1]);
    date.setSeconds(numericTimeComponents[2]);
    return date;
}

module.exports = {
    decodeTelemetryData: decodeTelemetryData,
    convertDateTimeStrings: convertDateTimeStrings,
    invalidTimeStringMessage: invalidTimeStringMessage,
    invalidDateStringMessage: invalidDateStringMessage,
    verifyChecksum: verifyChecksum
}