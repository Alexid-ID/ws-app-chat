require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

const UserRoute = require("./routes/user.route");
const GroupRoute = require("./routes/group.route");
const MessageRoute = require("./routes/message.route");
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

//TODO: chỉ cần đưa main route
// Routes Init
const route = require("./routes/index.js");
route(app);
// ------- Router -------
// app.use("/users", UserRoute);
// app.use("/groups", GroupRoute);
// app.use("/messages", MessageRoute);



//TODO: này là handle error middleware phát sinh 
// tự động bằng express validator có thể tham khảo
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('pages/error', { layout: false });
});


module.exports = app;
