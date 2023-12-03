const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
	{
		data: [
			{
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
	},
	{
		timestamps: true,
	}
);

module.exports = model("Message", MessageSchema, "messages");
