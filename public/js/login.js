$(document).ready(function() {
    handleLogin();
})

function handleLogin() {
    const loginForm = $('#loginForm');
    const loginBtn = $(loginForm).find(".button-login");
    const loginError = $(loginForm).find("#login-error");

    loginBtn.click(function(e) {
        e.preventDefault();
        const username = $(loginForm).find('input[name="username"]').val().trim();
        const password = $(loginForm).find('input[name="password"]').val().trim();

        if(!username || !password) {
            loginError.html(`<small>Please fill out all fields</small>`);
            return;
        } else {
            loginError.html('');
        }
        console.log(username, password);

        $.ajax({
            url: "/api/users/login",
            type: "POST",
            data: {
                username,
                password
            },
            success: function(data) {
                console.log(data);
                if(data.status === 'success') {
                    window.location.href = "/chat";
                } else {
                    loginError.html(`<small>${data.message}</small>`);
                }
            },
            error: function(err) {
                console.log(err);
                loginError.html(`<small>${err.responseJSON.message}</small>`);
            }
        })
    })
}