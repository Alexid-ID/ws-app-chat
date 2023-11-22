const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
	data: [
		{
			datetime: {
				type: Date,
				default: Date.now,
			},
			sender: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			chat: {
				dataType: {
					type: String,
					enum: ["text", "image", "file"],
				},
				datetime: {
					type: Date,
					default: Date.now,
				},
				content: {
					type: String,
				},
			},
		},
	],
});

module.exports = model("Message", MessageSchema, "messages");
