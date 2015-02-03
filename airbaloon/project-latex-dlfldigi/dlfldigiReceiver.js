var express = require('express');
var bodyParser = require('body-parser');
var telemetryKeys = require('./telemetryKeys.json');
var decoder = require('./telemetryDecoder');
var http = require('http');

var app = express();

function defaultContentTypeMiddleware (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
}

app.use(defaultContentTypeMiddleware);
app.use(bodyParser());

function postTelemetryInfo(telemetryInfo)  {
  var infoString = JSON.stringify(telemetryInfo);
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': infoString.length
  };
  var options = {
    host: 'project-latex-database-server.herokuapp.com',
    path: '/upload',
    method: 'POST',
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
    });
  });

  req.on('error', function(e) {
    console.log(e);
  });

  req.write(infoString);
  req.end();
}

app.all('*', function(req, res) {
    console.log('Handling ' + req.method + ' request');
    try {
        if (req.method === 'PUT' || req.method === 'POST')  {
            var base64data = req.body.data._raw;
            var keys = telemetryKeys.keys;
            var telemetryInfo = decoder.decodeTelemetryData(base64data, keys);

            // Our data originally has time as a string, but we convert it into a javascript date.
            // This should allow us to sort our data by time later on
            var dateTime = decoder.convertDateTimeStrings(telemetryInfo.date, telemetryInfo.time);
            telemetryInfo.time = dateTime;

            postTelemetryInfo(telemetryInfo);
        }
        res.send('Request received: ' + JSON.stringify(telemetryInfo));
    } catch(err) {
        res.status(400);
        res.send(err);
    }
});

var port = Number(process.env.PORT || 3000);
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});