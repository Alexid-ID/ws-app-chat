require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

const UserRoute = require("./routes/user.route");
const GroupRoute = require("./routes/group.route");
// const MessageRoute = require("./routes/message.route");
const passport = require("./config/passport");

// ------- Connect database -------
const db = require("./config/db");
db.connect();

// ------- Config -------
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);
app.use(passport.initialize());
app.use(passport.session());
// ------- Router -------
app.use("/users", UserRoute);
app.use("/groups", GroupRoute);
// app.use("/messages", MessageRoute);

// ------- Listen -------
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
