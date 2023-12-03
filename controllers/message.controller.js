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

	async getGroupMessages(req, res) {
		const { id } = req.params;
		console.log(id);
		const group = await GroupModel.findById(id);
		if (!group) return res.status(404).json({ message: "Group not found" });
		const messageId = group.messages;
		const messages = await MessageModel.find({ _id: { $in: messageId } });

		let returnMessages = [];
		for (let i = 0; i < messages.length; i++) {
			for (let j = 0; j < messages[i].data.length; j++) {
				const message = messages[i].data[j];
				const sender = await UserModel.findById(message.sender);
				returnMessages.push({
					sender: {
						_id: sender._id,
						name: sender.name,
						avatar: sender.avatar,
					},
					text: message.chat.content,
					type: message.chat.dataType,
					createdAt: message.chat.datetime,
				});
			}
		}

		return res.status(200).json({
			groupName: group.name,
			groupId: group._id,
			messages: returnMessages
		});
	}
}

module.exports = new MessageController();
