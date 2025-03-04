const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
	try {
		validateSignUpData(req);

		const { firstName, lastName, emailId, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: hashedPassword,
		});

		await user.save();
		res.send("User Added Succesfully");
	} catch (err) {
		res.status(400).send("Error: " + err.message);
	}
});

app.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("Invalid Credentials");
		}
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (isValidPassword) {
			res.send("Login Successfull");
		} else {
			throw new Error("Invalid Credentials");
		}
	} catch (error) {
		res.status(400).send("Error: " + error.message);
	}
});

app.get("/user", async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const user = await User.find({ emailId: userEmail });
		if (user.length == 0) {
			res.status(400).send("User not found");
		} else {
			res.send(user);
		}
	} catch (error) {
		res.status(400).send("something went wrong");
	}
});

app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(400).send("something went wrong");
	}
});

app.patch("/user/:userId", async (req, res) => {
	const userId = req.params?.userId;
	const data = req.body;
	console.log(data);
	try {
		const ALLOWED_UPDATES = ["gender", "about", "skills"];

		const isUpdateAllowed = Object.keys(data).every((k) =>
			ALLOWED_UPDATES.includes(k)
		);

		if (!isUpdateAllowed) {
			throw new Error("Update not allowed");
		}

		if (data?.skills.length > 10) {
			throw new Error("Skills cannot be more than 10");
		}
		const user = await User.findByIdAndUpdate(userId, data, {
			runValidators: true,
		});
		console.log(user);
		res.send("Data updated succesfully");
	} catch (error) {
		res.status(400).send("something went wrong" + error.message);
	}
});

app.delete("/user", async (req, res) => {
	const userId = req.body.userId;
	try {
		const user = await User.findByIdAndDelete(userId);
		res.send("User deleted Succesfully");
	} catch (error) {
		res.status(400).send("something went wrong");
	}
});

connectDB()
	.then(() => {
		console.log("Database Connection Established ...");

		app.listen(3000, () => {
			console.log("Server started listening on port 3000");
		});
	})
	.catch((err) => {
		console.log("Database cannot be connected ...");
	});
