'use strict'

History = require '../models/History'


exports.getAllHistory = (req, res) ->
	History.find {}, (err, items) ->
		if (err)
			res.status(500).end()
		res.json items

exports.postHistory = (req, res) ->
	if !req.body.calcul then return res.status(500).end()
	history = new History {calcul: req.body.calcul}
	history.save (err) ->
		if (err)
			return res.status(500).end()
		res.json history