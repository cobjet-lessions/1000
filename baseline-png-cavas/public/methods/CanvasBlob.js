function CanvasBlob(pushScore) {
    var timage = new Image(),
        canvas = document.getElementById('canvas3'),
        ctx = canvas.getContext("2d"),
        start,
        after;


    timage.onload = function () {
        ctx.drawImage(timage, 0, 0);
        window.URL.revokeObjectURL(timage.src);
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
        timage.src = window.URL.createObjectURL(dataURItoBlob(base64uri));
    };
}