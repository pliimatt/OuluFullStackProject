const mongoose = require("mongoose");

let schema = mongoose.Schema({
	todo: String,
	isDone: Boolean,
	deadLine: Date,
	user: {type: String, index: true}
})

module.exports = mongoose.model("Item", schema);