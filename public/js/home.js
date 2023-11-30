$(document).ready(function () {
    const socket = io();
    const buttonSend = $(".button-send");
    const chatInput = $("#chat-input");

    buttonSend.click(() => {
        const chatMessage = chatInput.val();
        socket.emit("on-chat", chatMessage);
        setInputDefault();
    });

    socket.on("user-chat", (data) => {
        console.log(data);
    });

    handleInput();
});

function handleInput() {
    const chatInput = $("#chat-input");
    chatInput.on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
        this.style.maxHeight = "120px";
        this.style.overflowY = "auto";
    });
}

function setInputDefault() {
    const chatInput = $("#chat-input");
    chatInput.val("");
    chatInput.setAttribute("style", "height: 40px;overflow-y:hidden;");
}
