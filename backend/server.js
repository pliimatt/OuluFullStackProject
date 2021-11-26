const express = require("express");
const routes = require("./routes/apiroutes");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const sessionModel = require("./models/session");
require('dotenv').config()

let app = express();

app.use(express.json());

//LOGIN DATABASES
const mongoUser = process.env.MONGOCLOUD_USER
const mongoPass = process.env.MONGOCLOUD_PASSWORD
const mongoUrlA = process.env.MONGOCLOUD_URL
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoUrlA}/todoProject?retryWrites=true&w=majority`
// console.log("Connecting to ", mongoUrl);
mongoose.connect(mongoUrl).then(
	() => console.log("Connected to Mongo Cloud"),
	(error) => console.log("Failed to connect to Mongo Cloud", error)
)

const time_to_live_diff = 3600000;

//HELPERS

createToken = () => {
	let token = crypto.randomBytes(128);
	return token.toString("hex");
}

isUserLogged = (req, res, next) => {
	if (!req.headers.token) {
		console.log("403: No token");
		return res.status(403).json({message: "Forbidden"})
	}
	sessionModel.findOne({"token": req.headers.token}, function (err, session) {
		if (err) {
			console.log("403: server error:", err);
			return res.status(403).json({message: "Internal server error"})
		}
		if (!session) {
			console.log("403: no session");
			return res.status(403).json({message: "Forbidden"})
		}
		let now = Date.now();
		if (session.ttl < now) {
			sessionModel.deleteOne({"_id": session._id}, function (err) {
				if (err) {
					console.log("Error:", err);
					console.log("Failed to delete session:", session._id)
				}
				console.log("403: timed out");
				return res.status(403).json({message: "Forbidden"})
			})
		} else {
			req.session = {};
			req.session.user = session.user;
			session.ttl = now + time_to_live_diff;
			session.save(function (err) {
				if (err) {
					console.log("Failed to update session:", err);
				}
				return next();
			})
		}
	})
}

//LOGIN API

app.post("/register", function (req, res) {
	console.log("Registering a new user.");
	if (!req.body) {
		console.log("400: No body");
		return res.status(400).json({message: "Bad Request"});
	}
	if (!req.body.username || !req.body.password) {
		console.log("400: No username or password");
		return res.status(400).json({message: "Bad Request"});
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		console.log("400: too short username or password");
		return res.status(400).json({message: "Bad Request"});
	}

	bcrypt.hash(req.body.password, 14, function (err, hash) {
		if (err) {
			console.log("500: server error:", err);
			return res.status(500).json({message: "Server error"})
		}
		let user = new userModel({
			username: req.body.username,
			password: hash
		})
		user.save(function (err, newuser) {
			if (err) {
				console.log("Failed to register new user:", err);
				if (err.code === 11000) {
					console.log("409: username already in use");
					return res.status(409).json({message: "Username already in use"})
				}
				console.log("500: server error");
				return res.status(500).json({message: "Internal server error"})
			}
			if (!newuser) {
				console.log("500: no new user");
				return res.status(500).json({message: "Internal server error"})
			}
			console.log("201: new user created");
			return res.status(201).json({message: "New user created!"});
		})
	})
})

app.post("/login", function (req, res) {
	console.log("Logging in.");
	if (!req.body) {
		console.log("400: No body");
		return res.status(400).json({message: "Bad Request"});
	}
	if (!req.body.username || !req.body.password) {
		console.log("400: No username or password");
		return res.status(400).json({message: "Bad Request"});
	}
	if (req.body.username.length < 4 || req.body.password.length < 8) {
		console.log("400: too short username or password");
		return res.status(400).json({message: "Bad Request"});
	}

	userModel.findOne({"username": req.body.username}, function (err, user) {
		if (err) {
			console.log("500: server error:", err);
			return res.status(500).json({message: "Internal Server Error"})
		}
		if (!user) {
			console.log("401: no user, unauthorized");
			return res.status(401).json({message: "Unauthorized"})
		}
		bcrypt.compare(req.body.password, user.password, function (err, success) {
			if (err) {
				console.log("500: server error:", err);
				return res.status(500).json({message: "Internal Server Error"})
			}
			if (!success) {
				console.log("401: No success, not authorized");
				return res.status(401).json({message: "Unauthorized"})
			}
			let token = createToken();
			let now = Date.now();
			let session = new sessionModel({
				token: token,
				user: user.username,
				ttl: now + time_to_live_diff
			})
			session.save(function (err) {
				if (err) {
					console.log("500: server error:", err);
					return res.status(500).json({message: "Internal Server Error"})
				}
				return res.status(200).json({token: token})
			})
		})
	})



})

app.post("/logout", function (req, res) {
	let token = req.headers.token
	if (!token) {
		console.log("No session found");
		return res.status(404).json({message: "not found"})
	}
	sessionModel.deleteOne({"token": token}, function (err) {
		if (err) {
			console.log("Failed to remove session with token", token, err)
		}
		return res.status(200).json({message: "logged out"})
	})
})

let port = process.env.PORT || 3001

app.use("/api", isUserLogged, routes);

app.listen(port);

console.log("Running in port " + port);