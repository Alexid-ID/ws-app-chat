$(document).ready(function () {
    const socket = io();
    const buttonSend = $(".button-send");
    const chatInput = $("#chat-input");
    const chatbody = $(".chatbox-body");

    buttonSend.click(() => {
        const chatMessage = chatInput.val();
        socket.emit("on-chat", chatMessage);
        setInputDefault();
    });

    socket.on("message", (data) => {
        console.log(data);
    //     append html
        chatbody.append(outputMessage(data));
    });

    handleInput();
});

function outputMessage(message) {
    const html =
        `<div
        class="chatbox-item right mb-2 d-flex align-items-end justify-content-end"
    >
        <div
            class="chatbox-content d-flex justify-content-end"
            style="width: 100%;"
        >
            <div class="chatbox-text">
                <p class="m-0 p-0">${message}</p>
            </div>
        </div>
    </div>`;
    return html;
}

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
    chatInput.css("height", "40px");
    chatInput.css("overflow-y", "hidden");
}
