function ImgBase64(pushScore) {
    var image1 = document.getElementById("image1"),
        start = new Date(),
        after;

    image1.onload = function () {
        if (window.URL) {
            window.URL.revokeObjectURL(image1.src);
        }

        pushScore(new Date() - start);
        if (after) {
            after();
            after = null;
        }
    };

    this.render = function (base64uri, callback) {
        start = new Date();
        after = callback;
        if (window.URL) {
            image1.src = window.URL.createObjectURL(dataURItoBlob(base64uri));
        } else {
            image1.src = base64uri;
        }
    };
}