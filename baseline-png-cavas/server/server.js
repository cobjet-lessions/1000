var fs = require('fs'),
    path = require('path'),
    sio = require('socket.io'),
    static = require('node-static');

var app = require('http').createServer(handler);
app.listen(8000);

var folders = {
  pub: path.join(__dirname, '..', 'public')
};
folders.stream = path.join(folders.pub, 'video-stream');

var file = new static.Server(folders.pub);

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getFramePath(frame) {
  return path.join(folders.stream, pad(frame, 8) + '.png');
}

function handler(req, res) {
  file.serve(req, res);
}

var io = sio.listen(app);
io.set('log level', 0);

io.sockets.on('connection', function (socket) {
    var max = 0;

    function sendImage(frame) {
        var filename = getFramePath(frame);
        fs.readFile(filename, function (err, data) {
            if (err) {
                if (frame === 1) {
                    throw err;
                } else {
                    max += frame - 1;
                    sendImage(1);
                }
            } else {
                var base64data = new Buffer(data).toString('base64'); 
                socket.emit('frame', 'data:image/png;base64,' + base64data);
            }
        });
    }

    socket.on('request frame', function (i) {
        sendImage(i - max);
    });

    socket.on('disconnect', function () {
        console.log('disconnected client');
    });
});
