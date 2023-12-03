require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const GroupModel = require("./models/group.model");
const MessageModel = require("./models/message.model");

const PORT = process.env.PORT || 3000;
const passport = require("./config/passport");
const connect = require("./config/db");
const route = require("./routes/main.route");
const UserModel = require("./models/user.model");

// ------- Config -------
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

app.use(passport.initialize());
app.use(passport.session());

// ------- Routes init -------
route(app);

async function init() {
	// -------------- Database --------------
	await connect();

	// -------------- Server --------------
	server.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

init();

// -------------- Socket --------------
io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("on-chat", async (data) => {
		console.log("on-chat");
		console.log(data);

		// save message to database
		try {
			const { groupId, messageId, sender, chat } = data;
			const message = await MessageModel.findById(messageId);
			let returnMessages = {};
			if(!message) {
				return;
			} else {
				message.data.push({ sender, chat });
				await message.save();
				console.log("save message success");
			}

			let user = await UserModel.findById(sender);
			if (!user) {
				return;
			} else {
				returnMessages = {
					groupId: groupId,
					messageId: messageId,
					sender: {
						_id: user._id,
						name: user.name,
						avatar: user.avatar,
					},
					text: chat.content,
					type: chat.dataType,
					createdAt: chat.datetime,
				};
			}
			io.emit("on-message", returnMessages);

		} catch (error) {
			console.log("save message error");
			console.log(error);
		}

	});

	// Broadcast when a user connects
	// socket.broadcast.emit("message", "A user has joined the chat");

	// Runs when client disconnects
	// socket.on("disconnect", () => {
	// 	io.emit("message", "A user has left the chat");
	// });
});