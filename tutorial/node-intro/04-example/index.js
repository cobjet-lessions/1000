var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/hello', function(req, res){
	res.send('hello web');
});

app.get('/hello/:name', function(req, res){
    res.send('hello ' + req.params.name);
});

app.post('/hello', function(req, res){
    res.send('hello ' + req.body.name);
});

app.listen(3000);
