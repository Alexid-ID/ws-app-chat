const UserController = require("../controllers/user.controller");

const router = require("express").Router();

router.get("/register", (req, res) => {
	return res.render("register", { title: "Register" });
});

router.get("/login", (req, res) => {
	return res.render("login", { title: "Login" });
});

module.exports = router;
