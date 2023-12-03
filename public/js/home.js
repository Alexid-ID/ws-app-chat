const socket = io();

$(document).ready(function () {
    handleInput();

    handleListMembers();

    handleSendMessage();

    getGroupMessages();

    createGroup();

    searchUser();

    logout();

    handleChatBoxSettings();

    handleLeaveGroup();

});

function sendMessage() {
    const chatInput = $("#chat-input");
    const chatMessage = chatInput.val().replace(/\n/g, "<br>");
    const messageId = $(".list-item.active").attr("data-message-id");
    const groupId = $(".current-contact").attr("data-id");
    const currentUserId = $(".current-info").attr("data-id");
    socket.emit("on-chat", {
        groupId: groupId,
        messageId: messageId,
        sender: currentUserId,
        chat: {
            content: chatMessage,
            dataType: "text",
            datetime: new Date(),
        },
    });
    setInputDefault();
    const messagesEmpty = $(".messages-empty");
    if(messagesEmpty) {
        messagesEmpty.remove();
    }
}

function handleSendMessage() {
    const chatboxBody = $(".chatbox-body");
    chatboxBody.scrollTop(chatboxBody.prop("scrollHeight"));

    const buttonSend = $(".button-send");
    const currentUserId = $(".current-info").attr("data-id");

    buttonSend.click(() => {
        sendMessage();
    });

    // if shift + enter then enter new line
    $("#chat-input").keydown((e) => {
        if (e.keyCode == 13 && e.shiftKey) {
            e.preventDefault();
            console.log("shift + enter")
            const chatInput = $("#chat-input");
            const chatMessage = chatInput.val();
            chatInput.val(chatMessage + "\n");
        }
    });

    //if enter then send message
    $("#chat-input").keydown((e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // sroll to bottom when new message
    socket.on("on-message", async (data) => {
        const currentGroupId = $(".current-contact").attr("data-id");
        if (data.groupId != currentGroupId) {
            return;
        }

        if (data.sender._id == currentUserId) {
            console.log("right");
            chatboxBody.append(
                `<div class="chatbox-item right mb-2 d-flex align-items-end justify-content-end">
                    <div
                        class="chatbox-content d-flex justify-content-end"
                        style="width: 100%;"
                    >
                        <div class="chatbox-text"><p class="m-0 p-0">${data.text}</p></div>
                    </div>
                </div>`
            );
        } else {
            console.log("left");
            chatboxBody.append(
                `<div class="chatbox-item left mb-2 d-flex align-items-end" >
                    <div class="chatbox-avatar">
                        <img
                            src="${data.sender.avatar}"
                            alt=""
                            width="28"
                            height="28"
                            class="rounded-circle"
                        />
                    </div>
                    <div class="chatbox-content">
                        <p class="user-name my-1 mx-0 p-0"><small>${data.sender.name}</small> - <small>${data.createdAt}</small></p>
                        <div
                            class="chatbox-text"
                        ><p class="m-0 p-0">${data.text}</p></div>
                    </div>
                </div>`
            );
        }

        chatboxBody.scrollTop(chatboxBody.prop("scrollHeight"));
    });
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

function handleListMembers() {
    const listMembers = $(".group-member-container");
    const showMemberBtns = $(".show-member-btn");

    for(let i = 0; i < listMembers.length; i++) {
        showMemberBtns[i].onclick = function (e) {
            e.preventDefault();

            if(listMembers[i].classList.contains("hide")) {
                listMembers[i].classList.remove("hide");
                showMemberBtns[i].querySelector("i").classList.remove("bx-chevron-down");
                showMemberBtns[i].querySelector("i").classList.add("bx-chevron-up");
            } else {
                listMembers[i].classList.add("hide");
                showMemberBtns[i].querySelector("i").classList.remove("bx-chevron-up");
                showMemberBtns[i].querySelector("i").classList.add("bx-chevron-down");
            }
        };
    }
}

function createGroup() {
    const createGroupModal = $("#create-group-modal");
    const buttonCreateGroup = $(createGroupModal).find(".button-create-group");
    const errorCreateGroup = $(createGroupModal).find(".error-create-group");
    const currentUserId = $(".current-info").attr("data-id");

    buttonCreateGroup.click(function (e) {
        e.preventDefault();
        const groupName = $(createGroupModal).find("#name").val().trim();

        //     list members - find checked members
        let members = [ currentUserId ];
        const memberList = $(createGroupModal).find(".member-list");
        const memberItems = memberList.find(".member-item");
        memberItems.each(function () {
            if ($(this).find("input").is(":checked")) {
                members.push($(this).find("input").attr("data-account-id"));
            }
        });

        console.log("members", members);

        if (groupName == "") {
            errorCreateGroup.html(`<p class="text-danger">Group name is required</p>`);
            return;
        }

        if (members.length < 3) {
            errorCreateGroup.html(`<p class="text-danger">Group must have at least 3 members</p>`);
            return;
        }



        $.ajax({
            url: `/api/groups/`,
            type: "POST",
            data: {
                name: groupName,
                members: members,
            },
            success: function (data) {
                console.log(data);
                if (data.status == "error") {
                    return;
                }
                window.location.reload();
            },
            error: function (err) {
                console.log(err);
            },
        });
    });
}

function addMember() {
    console.log("add member");
    const addMemberModal = $("#add-member-modal");
    const buttonAddMember = $(addMemberModal).find(".button-add-member");
    const showMemberBtn = $(addMemberModal).find(".show-member-btn");
    const memberList = $(addMemberModal).find(".member-list");
    const memberItems = memberList.find(".member-item");
    let listMembers = [];

    let groupId;

    showMemberBtn.click(function (e) {
        groupId = $(".current-contact").attr("data-id");
        console.log("click, group id", groupId);
        console.log("member items", memberItems);


        e.preventDefault();
        $.ajax({
            url: "api/groups/" + groupId,
            type: "GET",
            success: function (data) {
                console.log(data);
                listMembers = data.members;
                memberItems.each(function () {
                    const memberId = $(this).find("input").attr("data-account-id");
                    console.log("member id", memberId)
                    if (listMembers.includes(memberId)) {
                        console.log("checked")
                        $(this).find("input").prop("checked", true);
                        $(this).find("input").attr("disabled", true);
                    } else {
                        console.log("unchecked")
                        $(this).find("input").prop("checked", false);
                        $(this).find("input").attr("disabled", false);
                    }
                });

            },
            error: function (err) {
                console.log(err);
            }
        });
    })


    buttonAddMember.click(function (e) {
        e.preventDefault();
        const members = [];
        memberItems.each(function () {
            if ($(this).find("input").is(":checked") && !$(this).find("input").is(":disabled")) {
                members.push($(this).find("input").attr("data-account-id"));
            }
        });

        groupId = $(".current-contact").attr("data-id");

        console.log("group id", groupId)
        console.log("members", members);


        $.ajax({
            url: "/api/groups/" + groupId + "/members",
            type: "POST",
            data: {
                members: members,
            },
            success: function (data) {
                console.log(data);
                if (data.status == "error") {
                    return;
                }
                window.location.reload();
            },
            error: function (err) {
                console.log(err);
            },
        });
    });
}

function searchUser() {
    const addFriendForm = $("#addFriend");
    const inputName = addFriendForm.find("#name");
    const errorAddFriend = addFriendForm.find(".error-add-friend");
    const searchFriendResult = addFriendForm.find(".search-friend-result");

    addFriendForm.submit(function (e) {
        e.preventDefault();
    });

    inputName.keyup(function (e) {
        e.preventDefault();
        if (e.keyCode == 13) {
            e.preventDefault();
            const name = inputName.val().trim();
            if (name == "") {
                errorAddFriend.html(`<p class="text-danger">Name is required</p>`);
                return;
            }
            $.ajax({
                url: `/api/users/find/${name}`,
                type: "GET",
                success: function (data) {
                    console.log(data);
                    if (data.length == 0) {
                        errorAddFriend.html(`<p class="text-danger">User not found</p>`);
                        return;
                    }
                    searchFriendResult.html("");
                    data.users.forEach((user) => {
                        searchFriendResult.append(
                            `<div class="result-friend-item d-flex align-items-center justify-content-between">
                                <div class="result-friend-info d-flex align-items-center" data-id="${user._id}">
                                    <img src="${user.avatar}" alt="" width="32" height="32" class="rounded-circle">
                                    <h5 class="m-0 px-3" style="font-size: 16px;">${user.name}</h5>
                                </div>
                                <div class="result-friend-action">
                                    <button class="button-add-friend btn btn-small btn-outline-primary">Add</button>
                                </div>
                            </div>`
                        );
                    });

                    ajaxAddFriend();

                },
                error: function (err) {
                    console.log(err);
                },
            });
        }
    });
}

function ajaxAddFriend() {
    const resultFriendItems = $(".result-friend-item");
    const currentUserId = $(".current-info").attr("data-id");
    const peopleList = $(".people-list");
    let friends = [];
    peopleList.find(".people-item").each(function () {
        friends.push($(this).attr("data-account-id"));
    });

    resultFriendItems.each(function () {
        const buttonAddFriend = $(this).find(".button-add-friend");
        const friendId = $(this).find(".result-friend-info").attr("data-id").trim();

        console.log("friends", friends);
        console.log("friendId", friendId);

        if (friends.includes(friendId)) {
            buttonAddFriend.addClass("disabled");
            buttonAddFriend.html("Added");
        } else {
            console.log("available");
            buttonAddFriend.removeClass("disabled");
            buttonAddFriend.html("Add");

            buttonAddFriend.click(function (e) {
                e.preventDefault();

                $.ajax({
                    url: `/api/groups/`,
                    type: "POST",
                    data: {
                        name: "Private",
                        members: [currentUserId, friendId],
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.status == "error") {
                            return;
                        }
                        window.location.reload();
                    },
                    error: function (err) {
                        console.log(err);
                    },
                });
            });
        }
    });
}


function setInputDefault() {
    const chatInput = $("#chat-input");
    chatInput.val("");
    chatInput.css("height", "40px");
    chatInput.css("overflow-y", "hidden");
}

function getGroupMessages() {
    const defaultBackground = $(".default-background");

    let groups = $(".list-item");

    const allGroupMemberContainers = $(".group-member-container");
    const chatSettingList = $(".chat-setting-list");


    groups.click(function (e) {
        e.preventDefault();

        allGroupMemberContainers.each(function () {
            if(!$(this).hasClass("hide")) {
                $(this).addClass("hide");
                $(this).prev().find("i").removeClass("bx-chevron-up");
                $(this).prev().find("i").addClass("bx-chevron-down");
            }
        });

        if(!chatSettingList.hasClass("hide")) {
            chatSettingList.addClass("hide");
        }


        //default background add class hide
        if(!defaultBackground.hasClass("hide")) {
            defaultBackground.addClass("hide");
        }

        const groupId = $(this).attr("data-id");
        groups.removeClass("active");
        $(this).addClass("active");

        // current-contact
        const currentContact = $(".current-contact");
        currentContact.attr("data-id", groupId);

        const currentGroupAva = $(this).find(".list-avatar").find("img").attr("src");
        const currentGroupName = $(this).find(".list-info").find("h5").text();
        currentContact.find(".current-avatar").find("img").attr("src", currentGroupAva);
        currentContact.find(".current-name").find("h5").text(currentGroupName);

        $.ajax({
            url: `/api/messages/t/${groupId}`,
            type: "GET",
            success: function (data) {
                renderGroupMessages(data);
                const chatboxBody = $(".chatbox-body");
                chatboxBody.scrollTop(chatboxBody.prop("scrollHeight"));
            },
            error: function (err) {
                console.log(err);
            },
        });

    });

}

function renderGroupMessages(data) {
    const chatBody = $(".chatbox-body");
    const currentUserId = $(".current-info").attr("data-id");

    chatBody.html("");

    if(data.messages.length == 0 || !data.messages) {
        //notfiy no message
        chatBody.append(
            `<div class="text-center mt-5 messages-empty">
                <h5>No messages</h5>
            </div>`
        );
        return;
    }

    data.messages.forEach((message) => {
        if (message.sender._id == currentUserId) {
            chatBody.append(
                `<div class="chatbox-item right mb-2 d-flex align-items-end justify-content-end">
                    <div
                        class="chatbox-content d-flex justify-content-end"
                        style="width: 100%;"
                    >
                        <div class="chatbox-text"><p class="m-0 p-0">${message.text}</p></div>
                    </div>
                </div>`
            );
        } else {
            chatBody.append(
                `<div class="chatbox-item left mb-2 d-flex align-items-end" >
                    <div class="chatbox-avatar">
                        <img
                            src="${message.sender.avatar}"
                            alt=""
                            width="28"
                            height="28"
                            class="rounded-circle"
                        />
                    </div>
                    <div class="chatbox-content">
                        <p class="user-name my-1 mx-0 p-0"><small>${message.sender.name}</small> - <small>${message.createdAt}</small></p>
                        <div
                            class="chatbox-text"
                        ><p class="m-0 p-0">${message.text}</p></div>
                    </div>
                </div>`
            );
        }
    });
}

function logout() {
    const logoutBtn = $("#logout");
    logoutBtn.click(function (e) {
        e.preventDefault();
        $.ajax({
            url: `/api/users/logout`,
            type: "GET",
            success: function (data) {
                console.log(data);
                window.location.href = "/users/login";
            },
            error: function (err) {
                console.log(err);
            },
        });
    });
}

function handleChatBoxSettings() {
    const chatSettingBtn = $("#chat-setting-btn");
    const chatSettingList = $(".chat-setting-list");

    chatSettingBtn.click(function (e) {
        e.preventDefault();
        addMember();
        chatSettingList.toggleClass("hide");

        chatSettingList.find(".dropdown-item").click(function (e) {
            e.preventDefault();
            chatSettingList.toggleClass("hide");
        });
    });
}

function handleLeaveGroup() {
    const leaveGroupBtn = $("#leave-group");

    const confirmLeaveGroupBtn = $(".confirm-leave-group");

    leaveGroupBtn.click(function (e) {
        e.preventDefault();
        confirmLeaveGroupBtn.click(function (e) {
            e.preventDefault();
            const groupId = $(".current-contact").attr("data-id");
            const currentUserId = $(".current-info").attr("data-id");
            $.ajax({
                url: `/api/groups/leave`,
                type: "POST",
                data: {
                    userId: currentUserId,
                    groupId: groupId,
                },
                success: function (data) {
                    console.log(data);
                    window.location.reload();
                },
                error: function (err) {
                    console.log(err);
                },
            });
        });
    });
}
