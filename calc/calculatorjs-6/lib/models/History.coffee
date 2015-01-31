mongoose = require('mongoose')

HistorySchema = new mongoose.Schema({calcul: String})

module.exports = mongoose.model "History", HistorySchema