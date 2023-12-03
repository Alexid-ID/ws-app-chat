const UserController = require("../controllers/user.controller");

const router = require("express").Router();
const passport = require("passport");
router.get("/register", (req, res) => {
	res.send("register");
});

router.get("/login", (req, res) => {
    res.send("login");
});

router.post("/register", UserController.register);
router.post("/login", (req, res, next) => {
	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return res.status(500).json({ status: "error", message: err.message });
		}
		if (!user) {
			return res.status(400).json({ status: "success", message: info.message });
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.status(500).json({ status: "error", message: err.message });
			}
			req.session.user = user;
			req.session.save();
			return res.status(200).json({ status: "success", message: "Login success", user });
		});
	})(req, res, next);
});

router.get("/find/:username", UserController.find);

router.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		return res.redirect("/users/login")
	});
});

module.exports = router;
