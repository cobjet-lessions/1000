function SvgImageBase64(pushScore) {
    var image2 = document.getElementById("image2"), start, after;

    image2.onload = function () {
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
        image2.setAttributeNS('http://www.w3.org/1999/xlink','href', base64uri);
    };
}