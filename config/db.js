const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);
const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
	try {
		console.log(MONGODB_URI);
		await mongoose.connect(MONGODB_URI);
		console.log("Connect database success");
	} catch (err) {
		console.log("Can't connect database", err);
	}
};

module.exports = connect;
