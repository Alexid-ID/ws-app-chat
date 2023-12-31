const GroupModel = require("../models/group.model");
const UserModel = require("../models/user.model");
const MessageModel = require("../models/message.model");

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
			const message = new MessageModel();
			await message.save();
			let messages = message._id;
			const { name, members } = req.body;
			let avatar = null;

			if (!name) return res.status(400).json({ message: "Name is required" });

			if(members.length === 2) {
				const user1 = await UserModel.findById(members[0]);
				const user2 = await UserModel.findById(members[1]);

				if (!user1 || !user2) return res.status(404).json({message: "User not found"});

				const newGroup = new GroupModel({ name, avatar, members, messages });
				await newGroup.save();

				await UserModel.findByIdAndUpdate(members[0], { $push: { friends: members[1] } });
				await UserModel.findByIdAndUpdate(members[1], { $push: { friends: members[0] } });

				return res.status(201).json({ message: "Create connect success", group: newGroup });
			} else {
				avatar = "/images/group-default.png";
				const newGroup = new GroupModel({ name, avatar, members, messages });
				await newGroup.save();
				return res.status(201).json({ message: "Create group success", group: newGroup });
			}
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

	async addMember(req, res) {
		try {
			const { id } = req.params;
			const group = await GroupModel.findById(id);
			if (!group) return res.status(404).json({ message: "Group not found" });

			const { members } = req.body;

			const groupMembers = group.members;
			let newMembers = [];
			members.forEach((member) => {
				if (!groupMembers.includes(member)) {
					newMembers.push(member);
				}
			});

			group.members = [...group.members, ...newMembers];
			await group.save();

			return res.status(200).json({ message: "Add member success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async leaveGroup(req, res) {
		try {
			const { userId, groupId } = req.body;
			const user = await UserModel.findById(userId);
			const group = await GroupModel.findById(groupId);

			if (!user) return res.status(404).json({ message: "User not found" });
			if (!group) return res.status(404).json({ message: "Group not found" });

			group.members = group.members.filter((member) => member != userId);

			await group.save();
			await user.save();

			return res.status(200).json({ message: "Leave group success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}
}

module.exports = new GroupController();
