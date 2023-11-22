const GroupModel = require("../models/group.model");
const UserModel = require("../models/user.model");

class GroupController {
	async getAll(req, res) {
		try {
			const groups = await GroupModel.find();
			return res.status(200).json(groups);
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async getOne(req, res) {
		try {
			const group = await GroupModel.findById(req.params.id);
			return res.status(200).json(group);
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async create(req, res) {
		try {
            const { name, avatar, members } = req.body;
            console.log(req.body);
            const newGroup = new GroupModel({ name, avatar, members });
			await newGroup.save();
			return res.status(201).json({ message: "Create success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async update(req, res) {
		try {
			const { name, description } = req.body;
			await GroupModel.findByIdAndUpdate(req.params.id, { name, description });
			return res.status(200).json({ message: "Update success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async delete(req, res) {
		try {
			await GroupModel.findByIdAndDelete(req.params.id);
			return res.status(200).json({ message: "Delete success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}
}

module.exports = new GroupController();
