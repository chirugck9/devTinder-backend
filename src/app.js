const express = require("express");

const app = express();

app.use("/", (req, res) => {
	res.send("heyy chinmai");
});

app.use("/test", (req, res) => {
	res.send("Hello from the server");
});

app.listen(3000, () => {
	console.log("Server started listening on port 3000");
});
