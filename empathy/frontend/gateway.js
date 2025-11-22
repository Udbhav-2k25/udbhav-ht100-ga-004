const choiceBox = document.getElementById("choiceBox");
const loginBox = document.getElementById("loginBox");
const showLoginBtn = document.getElementById("showLoginBtn");
const backBtn = document.getElementById("backBtn");

showLoginBtn.onclick = () => {
    choiceBox.style.display = "none";
    loginBox.style.display = "block";
};


backBtn.onclick = () => {
    loginBox.style.display = "none";
    choiceBox.style.display = "block";
};



const logUser = document.getElementById("login_user");
const logPass = document.getElementById("login_pass");

const logBtn = document.getElementById("loginBtn");
const status = document.getElementById("loginStatus");

const errUser = document.getElementById("log_user_err");
const errPass = document.getElementById("log_pass_err");

logBtn.onclick = () => {

    errUser.textContent = "";
    errPass.textContent = "";
    status.textContent = "";

    const storedUser = localStorage.getItem("ee_account_user");
    const storedPass = localStorage.getItem("ee_account_pass");

    if (logUser.value.trim() === "") {
        errUser.textContent = "Enter username";
        return;
    }

    if (logPass.value.trim() === "") {
        errPass.textContent = "Enter password";
        return;
    }

    if (logUser.value === storedUser && logPass.value === storedPass) {
        status.style.color = "#8cff6b";
        status.textContent = "Login successful!";
        
        localStorage.setItem("ee_logged_in", "yes");

        setTimeout(() => window.location.href = "chat.html", 900);
    } else {
        status.style.color = "#ff7070";
        status.textContent = "Incorrect username or password";
    }
};