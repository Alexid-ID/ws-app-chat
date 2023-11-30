//TODO:chia main quản lý tác vụ trước sau , các phụ thuộc endpoint dễ nhìn hơn
const UserRoute = require("./user.route");
const GroupRoute = require("./group.route");
const MessageRoute = require("./message.route");
const AuthRoute = require("./auth.route");
const HomeRoute = require("./home.route");
// const checkUser = require("../app/middleware/checkUser");

const router = (app) => {
	app.use("/api/users", UserRoute);
	app.use("/api/groups", GroupRoute);
	// app.use("/api/messages", checkUser, MessageRoute);
	app.use("/api/messages", MessageRoute);

	app.use("/", AuthRoute);
	app.get("/", (req, res) => {
		return res.render("home", { title: "Home" });
	});
	// app.use("/", (req, res, next) => {
	// 	if (!req.isAuthenticated()) {
	// 		res.redirect("/login");
	// 	}
	// 	next();
	// }, HomeRoute);

	// app.use((req, res, next) => {
	// 	res.status(404).render("404", { title: "404" });
	// });
};

module.exports = router;
