const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	avatar: {
		type: String,
		default: "/images/group-default.png",
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: {
		type: Schema.Types.ObjectId,
		ref: "Message",
	},
});

const Group = mongoose.model("Group", GroupSchema, "groups");
module.exports = Group;
