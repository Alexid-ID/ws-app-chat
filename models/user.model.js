const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		username: {
			type: String,
			require: true,
		},
		password: {
			type: String,
			require: true,
		},
		avatar: {
			type: String,
			default: "/images/avatar-default.png",
		},
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: "Group",
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", UserSchema, "users");
module.exports = User;
