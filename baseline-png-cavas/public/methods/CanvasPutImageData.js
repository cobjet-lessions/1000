function CanvasPutImageData(pushScore) {
    var timage = new Image(),
        tcanvas = document.createElement('canvas'),
        canvas2 = document.getElementById('canvas2'),
        ctx2 = canvas2.getContext("2d"),
        tctx = tcanvas.getContext("2d"),
        tinit = false,
        start,
        after,
        width,
        height;

    timage.onload = function () {
        if (!width) { width = timage.width; }
        if (!height) { height = timage.height; }
        if (!tinit) {
            tcanvas.width  = width;
            tcanvas.height = height;
            tinit = true;
        }

        tctx.drawImage(timage, 0, 0);
        if (window.URL) {
            window.URL.revokeObjectURL(timage.src);
        }
        blob = tctx.getImageData(0, 0, width, height);
        ctx2.putImageData(blob, 0, 0);

        if (start) {
            pushScore(new Date() - start);
        }
        if (after) {
            after();
            after = null;
        }
    };

    this.render = function (base64uri, callback) {
        start = new Date();
        after = callback;
        if (window.URL) {
            timage.src = window.URL.createObjectURL(dataURItoBlob(base64uri));
        } else {
            timage.src = base64uri;
        }
    };
}