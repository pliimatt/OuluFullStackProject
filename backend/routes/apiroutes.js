const express = require("express");
const itemModel = require("../models/item");

let router = express.Router()

router.get("/todos", function (req, res) {
	let query = {"user": req.session.user}
	itemModel.find(query, function (err, items) {
		if (err) {
			console.log("500: server error", err);
			return res.status(500).json({message: "Internal server error"})
		}
		console.log("200: get todos");
		return res.status(200).json(items);
	})
})

router.post("/todos", function (req, res) {
	let item = new itemModel({
		...req.body,
		user: req.session.user
	})
	item.save(function (err) {
		if (err) {
			console.log("500: server error", err);
			return res.status(500).json({message: "Internal server error"})
		}
		console.log("201: post new todo");
		return res.status(201).json({message: "created"});
	})
})

router.delete("/todos/:id", function (req, res) {
	itemModel.deleteOne({"_id": req.params.id, "user": req.session.user}, function (err) {
		if (err) {
			console.log("500: server error", err);
			return res.status(500).json({message: "Internal server error"})
		}
		console.log("200: deleted todo");
		return res.status(200).json({message: "success!"})
	})
})

router.put("/todos/:id", function (req, res) {
	let item = {
		...req.body,
		user: req.session.user
	}
	itemModel.replaceOne({"_id": req.params.id, "user": req.session.user}, item, function (err, response) {
		if (err) {
			console.log("500: server error", err);
			return res.status(500).json({message: "Internal server error"})
		}
		if (!response.modifiedCount) {
			console.log("404: could not replace todo");
			return res.status(404).json({message: "Not found!"})
		}
		console.log("200: modified todo");
		return res.status(200).json({message: "success!"})
	})
})

module.exports = router;