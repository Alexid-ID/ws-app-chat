$(document).ready(function () {
    togglePass();
    handleRegister();
    handleAvatar();
});

function handleRegister() {
    console.log("REGISTER HERE")
    const registerForm = $('#registerForm');
    const registerBtn = $(registerForm).find(".button-register");
    const registerError = $(registerForm).find("#register-error");

    $(registerBtn).click(function (e) {
        e.preventDefault();
        const name = $(registerForm).find('input[name="name"]').val().trim();
        const username = $(registerForm).find('input[name="username"]').val().trim();
        const password = $(registerForm).find('input[name="password"]').val().trim();
        const avatar = $(registerForm).find('.avatar-item.active').find('img').attr('src');

        if (!name || !username || !password) {
            registerError.html(`<small>Please fill out all fields</small>`);
            return;
        } else {
            registerError.html('');
        }

        if (!validateUsername(username)) {
            registerError.html(`<small>Username only lowercase letters, numbers and underscores</small>`);
            return;
        } else {
            registerError.html('');
        }

        console.log(name, username, password, avatar, validateUsername(username));

        $.ajax({
            url: "/api/users/register",
            type: "POST",
            data: {
                name,
                username,
                password,
                avatar
            },
            success: function (data) {
                console.log(data);
                if(data.status === 'success') {
                    window.location.href = "/login";
                } else {
                    registerError.html(`<small>${data.message}</small>`);
                }
             },
            error: function (err) {
                console.log(err);
            }
        })
    });
}

function validateUsername(username) {
//     username only contains lowercase letters, numbers and underscores
    const re = /^[a-z0-9_]+$/;
    // if contains uppercase letters -> return false
    return !(/[A-Z]/.test(username)) && re.test(String(username).toLowerCase());
}
function togglePass() {
    const showPass = $('.show-pass');
    const inputPass = $('input[name="password"]');

    showPass.click(function () {
        let type = inputPass.attr('type');
        if (type === 'password') {
            inputPass.attr('type', 'text');
            showPass.html('<i class="bx bxs-hide"></i>');
        } else {
            inputPass.attr('type', 'password');
            showPass.html('<i class="bx bxs-show"></i>');
        }
    })
}

function handleAvatar() {
    const avatarList = $('.avatar-list');
    const avatarItems = $(avatarList).find('.avatar-item');
    avatarItems.click(function () {
        avatarItems.removeClass('active');
        $(this).addClass('active');
    });
}