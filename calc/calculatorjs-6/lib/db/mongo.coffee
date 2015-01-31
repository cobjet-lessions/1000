'use strict'

mongoose = require('mongoose')

exports.mongoose = mongoose

# Configure for possible deployment
uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/calculator'

mongoOptions = { db: { safe: true } }

# Connect to Database
mongoose.connect uristring, mongoOptions, (err, res) ->
	if (err)
		console.log "ERROR connecting to: #{uristring} .  #{err}"
	else
		console.log "Successfully connected to: #{uristring}"
