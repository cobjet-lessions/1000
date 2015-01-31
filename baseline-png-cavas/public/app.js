(function () {

    window.URL = window.URL || window.webkitURL;

    var frame = 0,
        scoreboard = new Scoreboard();

    scoreboard.register('Image', ImgBase64, document.getElementById("speed-img-base64"));
    scoreboard.register('Canvas.drawImage', CanvasDrawImage, document.getElementById("speed-canvas-base64"));
    scoreboard.register('Canvas.putImageData', CanvasPutImageData, document.getElementById("speed-pixel-base64"));
    if (window.URL) {
        scoreboard.register('Canvas.Blob', CanvasBlob, document.getElementById("speed-canvas-blob"));
    }
    
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        scoreboard.register('SvgImage', SvgImageBase64, document.getElementById("speed-svg-blob"));
    }

    var socket = io.connect();

    socket.on('frame', function (base64uri) {
        var can = 0, j;

        var next = function () {
            can += 1;
            if (can === scoreboard.count()) {
                socket.emit('request frame', ++frame);
                can = 0;
            }
        };

        setTimeout(function () {
            for (j = 0; j < scoreboard.impls.length; j++) {
                var impl = scoreboard.impls[j];
                impl.render(base64uri, next);
            }
        }, 0);
    });

    socket.emit('request frame', ++frame);
})();