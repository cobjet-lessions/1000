function CanvasDrawImage(pushScore) {
    var timage = new Image(),
        canvas1 = document.getElementById('canvas1'),
        ctx1 = canvas1.getContext("2d"),
        start,
        after;

    timage.onload = function () {
        ctx1.drawImage(timage, 0, 0);

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
        timage.src = base64uri;
    };
}