const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://user2000:testUser77@mongo-firebase.c3qno.mongodb.net/devTinder"
	);
};

module.exports = connectDB;
