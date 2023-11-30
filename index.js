require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const passport = require("./config/passport");
const connect = require("./config/db");
const route = require("./routes/main.route");

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
	socket.on("on-chat", (data) => {
		console.log(data);
		io.emit("message", data);
	});

	// Broadcast when a user connects
	// socket.broadcast.emit("message", "A user has joined the chat");

	// Runs when client disconnects
	// socket.on("disconnect", () => {
	// 	io.emit("message", "A user has left the chat");
	// });
});