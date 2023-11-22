const UserModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class UserController {
	async register(req, res) {
		try {
			console.log(req.body);
			let { name, username, password } = req.body;
			const existUser = await UserModel.find({ username });
			if (existUser.length) {
				return res.status(400).json({ message: "Username already exists" });
			}

			password = bcrypt.hashSync(password, salt);
			const newUser = new UserModel({ name, username, password });
			await newUser.save();
			return res.status(201).json({ message: "Register success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async login(req, res) {
		try {
			console.log(req.body);
			const { username, password } = req.body;
			const user = await UserModel.findOne({ username });
			console.log(user);

			if (!user) {
				return res.status(400).json({ message: "Username is incorrect" });
			}

			const isMatch = bcrypt.compareSync(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: "Password is incorrect" });
			}

			return res.status(200).json({ message: "Login success", user });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}
}

module.exports = new UserController();
