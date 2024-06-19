import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import ws from "ws";
import { WebSocketServer } from "ws";

mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// $ Middleware to parse the request body
app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.get("/test", (req, res) => {
	res.json("test ok");
});

// $ Route to get the user profile
app.get("/profile", (req, res) => {
	const token = req.cookies?.token;
	if (token) {
		jwt.verify(token, jwtSecret, {}, (err, userData) => {
			if (err) {
				console.error("JWT verification error:", err);
				res.status(401).json({ error: "Unauthenticated - invalid token" });
				throw err;
			}
			// const {id, username} = userData
			// res.json({
			//     id, username
			// })
			res.json(userData);
			// console.log(userData);
		});
	} else {
		res.status(401).json("Unauthenticated - no token");
	}
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const foundUser = await User.findOne({ username });
	if (foundUser) {
		const passOk = bcrypt.compareSync(password, foundUser.password);
		if (passOk) {
			jwt.sign(
				{ userId: foundUser._id, username },
				jwtSecret,
				{},
				(err, token) => {
					if (err) throw err;
					res
						.cookie("token", token, { sameSite: "none", secure: "true" })
						.status(200)
						.json({
							id: foundUser._id,
						});
				},
			);
		} else {
			res.status(401).json("Invalid credentials");
		}
	}
});

app.post("/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		// $ create the user
		const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
		const createdUser = await User.create({
			username,
			password: hashedPassword,
		});
		// $ Generate the JWT token
		jwt.sign(
			{ userId: createdUser._id, username },
			jwtSecret,
			{},
			(err, token) => {
				if (err) throw err;
				// $ Send the token to the client
				res
					.cookie("token", token, { sameSite: "none", secure: "true" })
					.status(201)
					.json({
						id: createdUser._id,
					});
			},
		);
	} catch (err) {
		if (err) throw err;
	}
});
const server = app.listen(4000);

const wss = new WebSocketServer({ server });
wss.on("connection", (connection, req) => {
	// console.log(req.headers);
	// $ When a client connects, we can check if they have a token
	// $ read usename and user id from the token for the connection
	const cookies = req.headers.cookie;
	if (cookies) {
		const tokenCookieString = cookies
			.split(";")
			.find((str) => str.startsWith("token="));
		if (tokenCookieString) {
			const token = tokenCookieString.split("=")[1];
			if (token) {
				jwt.verify(token, jwtSecret, {}, (err, userData) => {
					// $ If the token is valid, we can add the connection to a list of connections
					// $ and send messages to all of them
					// $ We can also use the token to identify the user
					// $ and send messages only to the connections of that user
					// $ (private messages)
					if (err) throw err;
					const { userId, username } = userData;
					connection.userId = userId;
					connection.username = username;
				});
			}
		}
	}

	connection.on("message", (message) => {
		const messageData = JSON.parse(message.toString());
		const { recipient, text } = messageData;
		if (recipient && text) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			[...wss.clients]
				.filter((c) => c.userId === recipient)
				.forEach((c) => c.send(JSON.stringify({ text })));
		}
	});

	// console.log([...wss.clients].map(c=> c.username));
	// $ Send the list of online people to all clients
	// function notifyAboutOnlinePeople() {
	// biome-ignore lint/complexity/noForEach: <explanation>
	[...wss.clients].forEach((client) => {
		client.send(
			JSON.stringify({
				online: [...wss.clients].map((c) => ({
					userId: c.userId,
					username: c.username,
				})),
			}),
		);
	});
	// }
});