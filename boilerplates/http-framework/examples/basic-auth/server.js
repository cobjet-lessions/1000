// based on https://github.com/senchalabs/connect/blob/master/examples/basicAuth.js
var basic = require("basic")
var http = require("http")

function sendBasicError(req, res) {
    res.statusCode = 401
    res.setHeader("WWW-Authenticate", "Basic realm=\"Secure Area\"")
    res.end("Unauthorized")
}

var auth = basic(function (user, pass, callback) {
    if (user === "tj" && pass === "tobi") {
        return callback(null)
    }

    callback(new Error("Access Denied"))
})

var server = http.createServer(function (req, res) {
    auth(req, res, function (err) {
        if (err) {
            return sendBasicError(req, res)
        }

        res.end("authorized!")
    })
})
server.listen(3000)
console.log("basic auth server listening on port 3000")
