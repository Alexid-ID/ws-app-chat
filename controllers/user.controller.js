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
}

module.exports = new UserController();
