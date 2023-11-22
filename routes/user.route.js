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
			return res.status(500).json({ message: err.message });
		}
		if (!user) {
			return res.status(400).json({ message: info.message });
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.status(500).json({ message: err.message });
			}
			return res.status(200).json({ message: "Login success", user });
		});
	})(req, res, next);
});

router.get("/test", (req, res) => {
	res.status(200).json({
		user: req.user,
		isAuthenticated: req.isAuthenticated(),
	});
});

router.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		return res.redirect("/users/login")
	});
});

module.exports = router;
