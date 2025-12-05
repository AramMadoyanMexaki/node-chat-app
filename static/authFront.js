const signUpform = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const userName = document.getElementById("usernameInput");
const email = document.getElementById("emailInput");
const password = document.getElementById("passwordInput");
const repeatPass = document.getElementById("repeatPass");
const btn = document.getElementById("submitBtn");

const socket = io();

if(signUpform){
    signUpform.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = userName ? userName.value.trim() : '';
        const emailValue = email ? email.value.trim() : '';
        const passwordValue = password ? password.value.trim() : '';
        const repeatPassword = repeatPass ? repeatPass.value.trim() : '';

        socket.emit("signUpData", {
            username: username,
            email: emailValue,
            password: passwordValue,
            repeatPassword: repeatPassword
        });
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        socket.emit("loginData", {
            email: emailValue,
            password: passwordValue
        });
    });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/login/";
    });
}

socket.on("signUpSuccess", (message) => {
    console.log(message);
    window.location.href = "/login";
});

socket.on("signUpError", (message) => {
    console.log(message);
});

socket.on("loginSuccess", (data) => {
    console.log(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    window.location.href = "/";
});

socket.on("loginError", (message) => {
    console.log("Login Error Received:", message); 
});
