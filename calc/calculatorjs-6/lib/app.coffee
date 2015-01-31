'use strict'

# Module dependencies.
express = require('express')
path = require('path')
fs = require('fs')
app = express()

# Connect to database
db = require('./db/mongo')

# Bootstrap models
modelsPath = path.join(__dirname, 'models')
fs.readdirSync(modelsPath).forEach (file) ->
	require("#{modelsPath}/#{file}")

# Express Configuration
require('./config/express')(app)

# Controllers
api = require('./controllers/api')
index = require('./controllers')

# Server Routes
app.get '/api/history', api.getAllHistory
app.post '/api/history', api.postHistory

# Angular Routes
app.get '/partials/*', index.partials
app.get '/*', index.index

# Start server
port = process.env.PORT || 3000
app.listen port, () ->
	console.log 'Express server listening on port %d', port

# Expose app
exports = module.exports = app