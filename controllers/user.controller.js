const UserModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

class UserController {
	async register(req, res) {
		try {
			let { name, username, password, avatar} = req.body;
			const existUser = await UserModel.find({ username });
			if (existUser.length) {
				return res.status(400).json({ message: "Username already exists" });
			}

			password = bcrypt.hashSync(password, salt);
			// const newUser = new UserModel({ name, username, password });
			let newUser;
			if(!avatar) {
				newUser = new UserModel({ name, username, password });
			} else {
				newUser = new UserModel({ name, username, password, avatar });
			}
			await newUser.save();
			return res.status(201).json({status: "success", message: "Register success", data: newUser});
		} catch (err) {
			return res.status(500).json({status: "error", message: err.message });
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

	async find(req, res) {
		try {
			const { username } = req.params;
			const users = await UserModel.find({username}).select("_id name username avatar");
			return res.status(200).json({ message: "Find success", users });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}
}

module.exports = new UserController();
