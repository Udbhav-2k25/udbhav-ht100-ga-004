const suUser = document.getElementById("su_user");
const suEmail = document.getElementById("su_email");
const suPass = document.getElementById("su_pass");
const suCPass = document.getElementById("su_cpass");

const signupBtn = document.getElementById("signupBtn");
const statusEl = document.getElementById("signupStatus");

const errUser = document.getElementById("su_user_err");
const errEmail = document.getElementById("su_email_err");
const errPass = document.getElementById("su_pass_err");
const errCPass = document.getElementById("su_cpass_err");

signupBtn.onclick = () => {

    
    errUser.textContent = "";
    errEmail.textContent = "";
    errPass.textContent = "";
    errCPass.textContent = "";
    statusEl.textContent = "";
    statusEl.style.color = "#ff7070";

    let valid = true;

    
    if (suUser.value.trim() === "") {
        errUser.textContent = "Username is required";
        valid = false;
    }

    if (suEmail.value.trim() === "") {
        errEmail.textContent = "Email is required";
        valid = false;
    }

    if (suPass.value.trim() === "") {
        errPass.textContent = "Password is required";
        valid = false;
    }

    if (suCPass.value.trim() === "") {
        errCPass.textContent = "Password is required";
        valid = false;
    }

    if (suPass.value !== suCPass.value) {
        errCPass.textContent = "Passwords do not match";
        valid = false;
    }

    if (!valid) return;

    
    localStorage.setItem("ee_account_user", suUser.value.trim());
    localStorage.setItem("ee_account_email", suEmail.value.trim());
    localStorage.setItem("ee_account_pass", suPass.value.trim());

    statusEl.style.color = "#8cff6b";
    statusEl.textContent = "Account created successfully! Redirecting...";

    setTimeout(() => {
        window.location.href = "gateway.html";
    }, 1200);
};