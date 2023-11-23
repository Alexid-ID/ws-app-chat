const MessageModel = require("../models/message.model");
const UserModel = require("../models/user.model");
const GroupModel = require("../models/group.model");

class MessageController {
	async getOne(req, res) {
		try {
			const message = await MessageModel.findById(req.params.id);
			return res.status(200).json(message);
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}

	async chat(req, res) {
		try {
			const { id } = req.params;
			const { sender, chat } = req.body;
			const message = await MessageModel.findById(id);
			if (!message) return res.status(404).json({ message: "Message not found" });

			const user = await UserModel.findById(sender);
			if (!user) return res.status(404).json({ message: "User not found" });

			message.data.push({ sender, chat });
			await message.save();

			return res.status(200).json({ message: "Chat success" });
		} catch (err) {
			return res.status(500).json({ message: err.message });
		}
	}
}

module.exports = new MessageController();
